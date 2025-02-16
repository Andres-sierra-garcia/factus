<template>
  <q-page>
    <div class="q-pa-md">
      <q-table flat bordered :rows="rows" :columns="columns" row-key="name">
        <!--espacio para cuadrar los templates mas tarde-->
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getData } from '../services/apiclient';

const columns = ref([
  {name: "number",align: "center", label:"Numero", field:"number", sortable: true},
  { name: "api_client_name", align: "center", label: "email ", field: "api_client_name", sortable: true },
  { name: "reference_code", align: "center", label: "Código de Referencia", field: "reference_code", sortable: true },
  { name: "identification", align: "center", label: "Identificación", field: "identification", sortable: true },
  { name: "graphic_representation_name", align: "center", label: "Representación Gráfica", field: "graphic_representation_name", sortable: true },
  { name: "company", align: "center", label: "Empresa", field: "company", sortable: true },
  { name: "trade_name", align: "center", label: "Nombre Comercial", field: "trade_name", sortable: true },
  { name: "names", align: "center", label: "Nombre", field: "names", sortable: true },
  { name: "email", align: "center", label: "Correo Electrónico", field: "email", sortable: true },
  { name: "total", align: "center", label: "Total", field: "total", sortable: true }

])

let rows = ref([])

async function dataFacturas(){
try {
  const response = await getData("/v1/bills?filter[identification]&filter[names]&filter[number]&filter[prefix]&filter[reference_code]&filter[status]")
  if(response.data){
    rows.value=response.data.data
    console.log(response.data.data);
  }
} catch (error) {
  console.log(error);
}
}



onMounted(()=>{
  dataFacturas()
})

</script>