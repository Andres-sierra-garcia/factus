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
import { getDataFactus } from '../services/factus.js';

const columns = ref([
  {name: "number",align: "center", label:"Numero", field:"number", sortable: true},
  { name: "api_client_name", align: "center", label: "cliente", field: "api_client_name", sortable: true },
  { name: "reference_code", align: "center", label: "Código de Referencia", field: "reference_code", sortable: true },
  { name: "identification", align: "center", label: "Identificación", field: "identification", sortable: true },
  { name: "names", align: "center", label: "Nombre", field: "names", sortable: true },
  { name: "email", align: "center", label: "Correo Electrónico", field: "email", sortable: true },
  { name: "total", align: "center", label: "Total", field: "total", sortable: true }

])

let rows = ref([])

async function dataFacturas(){

try {
  const response = await getDataFactus("https://api-sandbox.factus.com.co/v1/bills?filter[identification]&filter[names]&filter[number]&filter[prefix]&filter[reference_code]&filter[status]")
  if(response.data){
    rows.value=response.data.data
  }

} catch (error) {
  console.log(error);
}
}



onMounted(()=>{
  dataFacturas()
})

</script>