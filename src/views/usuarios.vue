<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <h3>Crear nuevo usuario</h3>
        <hr>
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-select v-model="customer.identification_document_id" :options="documents" option-label="name"
            option-value="id" emit-value map-options label="Tipo de documento" filled />

          <q-input v-model="customer.identification" type="number" label="Numero de identificacion" filled />
          <q-input v-model="customer.dv" label="Codigo de verificacion"
            v-show="customer.identification_document_id == 6" filled />

          <q-select v-model="customer.legal_organization_id" :options="customerTypes" option-label="type"
            option-value="id" emit-value map-options label="Tipo de cliente" filled />

          <q-input v-model="customer.company" v-show="customer.legal_organization_id == 1" label="Razon Social"
            filled />
          <q-input v-model="customer.trade_name" v-show="customer.legal_organization_id == 1" label="Nombre Comercial"
            filled />
          <q-input v-model="customer.names" label="Nombres" filled />
          <q-input v-model="customer.address" label="Dirección" filled />
          <q-input v-model="customer.email" label="Correo Electrónico" type="email" filled />
          <q-input v-model="customer.phone" label="Teléfono" type="tel" filled />

          <q-select v-model="customer.tribute_id" :options="customerTributes" option-label="tribute" option-value="id"
            emit-value map-options label="Tributo" filled />

          <q-select clearable use-input input-debounce="0" @filter="filterFn" v-model="customer.municipality_id" :options="municipalities" option-label="name" option-value="id"
            emit-value map-options label="Municipio" filled />
        </q-form>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <q-btn @click="postCustomer()" label="Enviar" color="primary" :loading="loading" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { postData } from '../services/apiclient';
import { useQuasar } from 'quasar';
import { getDataFactus } from '../services/factus';
const $q = useQuasar();
const loading = ref(false)
const customer = ref({})

const documents = [
  { id: 1, name: "Registro civil" },
  { id: 2, name: "Tarjeta de identidad" },
  { id: 3, name: "Cédula de ciudadanía" },
  { id: 4, name: "Tarjeta de extranjería" },
  { id: 5, name: "Cédula de extranjería" },
  { id: 6, name: "NIT" },
  { id: 7, name: "Pasaporte" },
  { id: 8, name: "Documento de identificación extranjero" },
  { id: 9, name: "PEP" },
  { id: 10, name: "NIT otro país" },
  { id: 11, name: "NUIP" }
];
const customerTypes = [
  { id: 1, type: "Persona Jurídica" },
  { id: 2, type: "Persona Natural" }
]
const customerTributes = [
  { id: 18, tribute: "IVA" },
  { id: 21, tribute: "No aplica *" }
]
const municipalities = ref([])

async function filterFn(val, update) {
    if (val === '') {
        update(() => {
            getMunicipalities(); // Mostrar todos si el campo está vacío
        });
        return;
    }

    const needle = val.toLowerCase();
    update(() => {
        municipalities.value = municipalities.value.filter(v => v.name.toLowerCase().includes(needle));
    });
}

async function getMunicipalities() {
  try {
    const response = await getDataFactus("/v1/municipalities")
    municipalities.value = response.data;

  } catch (error) {
    console.log("error when bringing municipalities", error);
  }
}
async function postCustomer() {
  loading.value = true
  try {
    const response = await postData("/customer", {
      identification: customer.value.identification,
      dv: customer.value.dv,
      company: customer.value.company,
      trade_name: customer.value.trade_name,
      names: customer.value.names,
      address: customer.value.address,
      email: customer.value.email,
      phone: customer.value.phone,
      legal_organization_id: customer.value.legal_organization_id,
      tribute_id: customer.value.tribute_id,
      identification_document_id: customer.value.identification_document_id,
      municipality_id: customer.value.municipality_id
    })

    if (response) {
      showDefault("registro exitoso", "green")
    }
  } catch (error) {
    showDefault("registro fallido", "red")
    console.log("error al registrar cliente", error);
  }
  finally {
    loading.value = false;
  }
}
function showDefault(message, color) {
  $q.notify({
    message: message,
    timeout: 100,
    color: color
  })
}

onMounted(()=>{
  getMunicipalities();
})

</script>

<style src="../styles/usuario.css"></style>
