<template>
  <q-page>
    <div class="q-pa-md">
      <h2 class="text-center">Mis facturas</h2>

      <q-table flat bordered :rows="rows" :columns="columns" row-key="name">

        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <q-btn icon="visibility" @click="dialog = true;
            invoice = props.row
              "></q-btn>
          </q-td>
        </template>
      </q-table>

      <!--modal para visualisar factura en detalle-->

      <q-dialog v-model="dialog" persistent :maximized="maximizedToggle" transition-show="slide-up"
        transition-hide="slide-down">
        <q-card class="bodyInvoice">
          <q-space/>
          <q-btn flat color="primary" @click="dialog = false" icon="close" style="align-self: flex-end;" />


          <q-card-section class="headerInvoice">
            <h3 class="text-h4 text-weight-bold text-primary">Factura de venta electronica <strong class="text-h3 text-weight-bold text-primary">{{ invoice.number }}</strong></h3>
            <q-img :src="invoice.qr_image" class="qr_code" alt="Codigo QR" spinner-color="primary" />
          </q-card-section>

          <q-card-section class="optionsInvoice ">
            <q-btn icon="download" @click="downloadPdf(invoice.number)">Descargar pdf</q-btn>
            <q-btn icon="share" @click="share=true">Compartir</q-btn>
            <q-btn icon="email">Enviar por correo</q-btn>
            <q-btn icon="receipt" :href="invoice.url" target="_blank">Ver factura</q-btn>
          </q-card-section>

          <q-card-section class="MainInvoice">



            <q-card-section style="margin-bottom: 15px;">
              <table border="1">
                <thead>
                  <tr>
                    <th>Codigo de referencia</th>
                    <th>fecha de factura</th>
                    <th>fecha de vencimiento</th>
                    <th>Observaciones</th>
                    <th>Numero</th>
                    <th>forma de pago</th>
                    <th>total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{{ invoice.reference_code }}</th>
                    <th>{{ invoice.billing_period.start_date }}</th>
                    <th>{{ invoice.billing_period.end_date }}</th>
                    <th>{{ invoice.observation }}</th>
                    <th>{{ invoice.number }}</th>
                    <th>{{ invoice.payment_form == 1 ? "pago de contado" : "pago a credito" }}</th>
                    <th>{{ invoice.total }}</th>
                  </tr>
                </tbody>
              </table>

              <q-card-section class="flex justify-end">
                <table class="tableNumberToLetters">
                <thead>
                  <tr>
                    <th>Valor en letras</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{{ numberToLetters(invoice.total) }}</th>
                  </tr>
                </tbody>
              </table>
              </q-card-section>
            </q-card-section>

            <hr style="height: 3px; background-color:var(--fifth-color); border: 0px; border-radius: 5px;">

            <q-card-section class="customerAndItems">

              <table border="1" class="tableCustomer">
                <caption><strong>Cliente</strong></caption>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>identificacion</th>
                    <th>Direccion</th>
                    <th>Email</th>
                    <th>Telefono</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <th>{{ invoice.customer.names }}</th>
                    <th>{{ invoice.customer.identification }}</th>
                    <th>{{ invoice.customer.address }}</th>
                    <th>{{ invoice.customer.email }}</th>
                    <th>{{ invoice.customer.phone }}</th>
                  </tr>
                </tbody>
              </table>

              <table border="1" class="tableProductos">
                <caption><strong>productos</strong></caption>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Codigo de referencia</th>
                    <th>Tasa impositiva</th>
                    <th>Tasa de descuento</th>
                    <th>Iva</th> <!--configurar para decir si incluye iba o no 1 cuando no incluye 0 cuando si-->
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item of invoice.items">
                    <th>{{ item.name }}</th>
                    <th>{{ item.price }}</th>
                    <th>{{ item.quantity }}</th>
                    <th>{{ item.code_reference }}</th>
                    <th>{{ item.tax_rate }}</th>
                    <th>{{ item.discount_rate }}</th>
                    <th>{{ item.is_excluded = 0 ? "si incluye" : "no incluye" }}</th>


                  </tr>
                </tbody>
              </table>
            </q-card-section>

            <q-card-section >
             
            </q-card-section>

            <hr style="height: 3px; background-color:var(--fifth-color); border: 0px; border-radius: 5px;">

            <q-card-section>
              
             <section style="display: flex; flex-direction: column; width:60%;">
              <h3>Observaciones</h3>  
              <q-input filled v-model="invoice.observation" type="textarea" disable style="width: auto;" />
             </section>
            </q-card-section>

            <q-card-section class="close">
              <h5>CUFE: {{ invoice.cufe }}</h5>
            </q-card-section>

          </q-card-section>

        </q-card>
      </q-dialog>
      <q-dialog v-model="share">
        <q-card class="q-pa-md">
          <h5>Digita el numero telefonico</h5>
          <q-card-section class="flex items-center" style="gap: 30px;">
            <q-input type="number" v-model="phoneLink" icon="phone" filled></q-input>
            <q-btn icon="send" @click="shareWhatsapp()"></q-btn>
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
import { NumerosALetras } from "numero-a-letras";
import { useQuasar } from 'quasar';


const $q = useQuasar()
const phoneLink = ref(null)
const share = ref(false)
let dialog = ref(false)
let maximizedToggle = ref(true)
let invoice = ({})
const invoiceColumns = ref([
  { name: "name", align: "center", field: "names", label: "Nombre" },
  { name: "address", align: "center", field: "address", label: "Direccion" },
  { name: "email", align: "center", field: "email", label: "Email" },
  { name: "identification", align: "center", field: "identification", label: "Identificacion" },
  { name: "phone", align: "center", field: "phone", label: "Telefono" }
])

//tabla principal
const columns = ref([
  { name: "number", align: "center", label: "Numero", field: "number", sortable: true },
  { name: "reference_code", align: "center", label: "Código de Referencia", field: "reference_code", sortable: true },
  { name: "customer", align: "center", label: "cliente", field: (invoice) => invoice.customer.names, sortable: true },
  { name: "email", align: "center", label: "Correo Electrónico", field: (invoice) => invoice.customer.email, sortable: true },
  { name: "total", align: "center", label: "Total", field: "total", sortable: true },
  { name: "option", align: "center", label: "detalles", classes: "colums" }

])
let rows = ref([])

//tabla items seccion detalles facturas
const itemsColumns = ref([
  { name: "code_reference", align: "center", field: "code_reference", label: "codigo de referencia", sortable: true },
  { name: "name", align: "center", field: "name", label: "Nombre", sortable: true },
  { name: "quantity", align: "center", field: "quantity", label: "Cantidad", sortable: true },
  { name: "price", align: "center", field: "price", label: "precio", sortable: true },
  { name: "tax_rate", align: "center", field: "tax_rate", label: "Tasa impositiva", sortable: true },
])

async function dataFacturas() {
  try {
    const response = await getData("/invoice/invoices")
    if (response) {
      rows.value = response.reverse
    }
    console.log("faturas backend", response);
  } catch (error) {
    console.log(error);
  }
}

async function downloadPdf(number) {
  console.log("numero de factura", number);
  try {
    const response = await getDataFactus("/v1/bills/download-pdf/" + number)
    const { file_name, pdf_base_64_encoded } = response.data
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

function shareWhatsapp (){
if(phoneLink.value){
  const message = encodeURIComponent(`Hola , aqui esta tu factura : ${invoice.url}`)
  const whatsappLink =`https://wa.me/${57 + phoneLink.value}?text=${message}`; 
  window.open(whatsappLink)
}else{
  showDefault("por favor digita un numero telefonico","red")
}
}

const numberToLetters = (number) => {
  return NumerosALetras(number);
};

function showDefault(message, color) {
  $q.notify({
    message: message,
    timeout: 100,
    color: color
  })
}

onMounted(() => {
  dataFacturas()
})

</script>
<style scoped>
 @import "../styles/facturas.css"
</style>