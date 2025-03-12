<template>
  <q-page>
    <div class="q-pa-md">
      <q-table flat bordered :rows="rows" :columns="columns" row-key="name">

        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <q-btn icon="delete"></q-btn>
            <q-btn icon="visibility" @click="dialog = true;
            invoice = props.row
            "></q-btn>
          </q-td>
        </template>
      </q-table>

      <!--modal para visualisar factura en detalle-->

      <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bodyInvoice">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="headerInvoice">
          <p class="text-h3 text-weight-bold text-primary">Informacion de la factura</p>
          <q-img :src="invoice.qr_image" class="qr_code" alt="Codigo QR" spinner-color="primary"/>
        </q-card-section>

        <q-card-section class="MainInvoice">
          <q-card-section class="infoInvoice">
            <p>Codigo de referencia: {{ invoice.reference_code }}</p>
          <p>Fecha: {{ invoice.billing_period.start_date }}</p>
          <p>Observaciones {{ invoice.observation }}</p>
          <p>Numero: {{ invoice.number }}</p>
          <p>Forma de pago: {{ invoice.payment_form == 1 ? "pago de contado": "pago a credito" }}</p>
          <p>Total: {{ invoice.total }}</p>
          </q-card-section>
            
          <hr style="height: 3px; background-color: #adb5bd; border: 0px; border-radius: 5px;">

          <q-card-section class="customerAndItems">

            <q-card-section class="customer">
              <section class="customerTitle">
                <h5 class="text-h5 text-weight-medium text-primary">Cliente  <q-icon name="person"></q-icon></h5>
              </section>
              <q-table :rows="[invoice.customer]" :columns="invoiceColumns"></q-table>
            </q-card-section> 
            
            <q-card-section class="items">
              <section class="itemsTitle">
                <h5 class="text-h5 text-weight-medium text-primary">Productos <q-icon name="category"></q-icon></h5>
              </section>
              <q-table :rows="invoice.items" :columns="itemsColumns"></q-table>
            </q-card-section>

          </q-card-section>

          <q-card-section class="downloadAndBack">
            <q-btn icon="arrow_back" @click="dialog = false"></q-btn>
            <q-btn icon="download" @click="downloadPdf(invoice.number)">Descargar pdf</q-btn>
          </q-card-section>
            
        </q-card-section>

      </q-card>
    </q-dialog>
    </div>
  </q-page>
</template> 

<script setup>
import { onMounted, ref } from 'vue';
import { getData } from '../services/apiclient.js';
import { getDataFactus } from '../services/factus.js';

//maximixed
let dialog =ref(false)
let maximizedToggle = ref(true)
let invoice = ({})
/* <!--  <p>Nombre: {{ invoice.customer.names }}</p>
                <p>direccion: {{ invoice.customer.address }}</p>
                <p>Email: {{ invoice.customer.email }}</p>
                <p>identificacion: {{ invoice.customer.identification }}</p>
                <p>telefono:{{ invoice.customer.phone }}</p> --> */
const invoiceColumns =ref([
  {name:"name", align:"center", field:"names", label:"Nombre"},
  {name:"address", align:"center", field:"address", label:"Direccion"},
  {name:"email", align:"center", field:"email", label:"Email"},
  {name:"identification", align:"center", field:"identification", label:"Identificacion"},
  {name:"phone", align:"center", field:"phone", label:"Telefono"}
])

//tabla principal
const columns = ref([
  {name: "number",align: "center", label:"Numero", field:"number", sortable: true},
  { name: "reference_code", align: "center", label: "Código de Referencia", field: "reference_code", sortable: true },
  { name: "customer", align: "center", label: "cliente", field:(invoice)=> invoice.customer.names, sortable: true },
  { name: "email", align: "center", label: "Correo Electrónico", field: (invoice)=> invoice.customer.email, sortable: true },
  { name: "total", align: "center", label: "Total", field: "total", sortable: true },
  { name: "option", align:"center", label: "opciones", classes:"colums"}

])
let rows = ref([])

//tabla items seccion detalles facturas
const itemsColumns= ref([
  {name:"code_reference", align:"center", field:"code_reference", label:"codigo de referencia", sortable:true},
  {name:"name", align:"center", field:"name", label:"Nombre", sortable:true},
  {name:"quantity", align:"center", field:"quantity", label:"Cantidad", sortable:true},
  {name:"price", align:"center", field:"price", label:"precio", sortable:true},
  {name:"tax_rate", align:"center", field:"tax_rate", label:"Tasa impositiva", sortable:true},
])

async function dataFacturas(){
try {
  const response = await getData("/invoice/invoices")
  if(response){
    rows.value=response.invoices
  }
  console.log("faturas backend",response);
} catch (error) {
  console.log(error);
}
}

async function downloadPdf(number){
  console.log("numero de factura", number);
  try {
    const response = await getDataFactus("/v1/bills/download-pdf/"+ number)
    const {file_name, pdf_base_64_encoded} = response.data
    const byteCharacters = atob(pdf_base_64_encoded);
    const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const fileBlob = new Blob([byteArray], { type: "application/pdf" });

    const fileUrl = URL.createObjectURL(fileBlob);
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = `${file_name}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(fileUrl);

  } catch (error) {
    console.error("Error al descargar el PDF:", error);
  }
  
}



onMounted(()=>{
  dataFacturas()
})

</script>
<style scoped> @import "../styles/facturas.css"</style>