<template>
    <q-page class="q-pa-md">
        <q-card>
            <q-card-section>
                <h3>Crear items</h3>
                <hr>
            </q-card-section>
            <q-card-section class="q-pa-md">
                <q-form>
                    <q-input v-model="item.code_reference" label="Referencia de Código" filled required />

                    <q-input v-model="item.name" label="Nombre" filled required />

                    <q-input v-model.number="item.discount_rate" label="Tasa de Descuento(%)" type="number" filled
                        step="0.01" required />

                    <q-input v-model="item.tax_rate" label="Tasa de Impuesto" filled required />


                    <q-input v-model="item.normalPrice" @update:modelValue="priceWithTax" label="Precio sin Impuesto"
                        type="number" filled required />

                    <q-input disable label="precio con impuesto" :model-value="item.price" filled></q-input>

                    <q-select v-model.number="item.unit_measure_id" :options="unitsOfMeasure" option-label="name"
                        option-value="id" emit-value map-options label="ID Unidad de Medida" type="number" filled
                        required />

                    <q-select v-model.number="item.standard_code_id" :options="standards" option-label="nombre"
                        option-value="id" emit-value map-options label=" Código Estándar" type="number" filled
                        required />

                    <q-select v-model.number="item.tribute_id" :options="tributes" option-label="name" option-value="id"
                        emit-value map-options label="Tributo" type="number" filled required />

                    <q-select v-model.number="item.is_excluded" :options="IVA" option-label="name" option-value="id"
                        emit-value map-options label="IVA" type="number" filled required />

                </q-form>
            </q-card-section>
            <q-card-section class="q-pa-md" >
                <q-btn @click="postItem()" color="primary" label="Enviar" :loading="loading"></q-btn>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { onMounted, ref, } from 'vue';
import { getDataFactus } from '../services/factus';
import { postData } from '../services/apiclient';
import { useQuasar } from 'quasar';
const item = ref({})
const loading = ref(false)
const $q = useQuasar();

const standards = [
    { id: 1, nombre: "Estándar de adopción del contribuyente" },
    { id: 2, nombre: "UNSPSC" },
    { id: 3, nombre: "Partida Arancelaria" },
    { id: 4, nombre: "GTIN" }
];
const IVA = [
    { id: 0, name: "Incluye" },
    { id: 1, name: "No incluye" }
]
const tributes = ref([])


function priceWithTax(value) {
    const taxRate = eliminarSeparadores(item.value.tax_rate || 0)
    const price = Number(value)
    const tax = price * (taxRate / 100)
    item.value.price = price + tax
    return price + tax
};

const unitsOfMeasure = ref([])

async function postItem() {
    loading.value = true
    try {
        const response = await postData("/item",{
            code_reference:item.value.code_reference,
            name:item.value.name,
            discount_rate:item.value.discount_rate,
            price:item.value.price,
            tax_rate:eliminarSeparadores(item.value.tax_rate),
            unit_measure_id:item.value.unit_measure_id,
            standard_code_id:item.value.standard_code_id,
            is_excluded:item.value.is_excluded,
            tribute_id:item.value.tribute_id
        })
        if(response.item){
            console.log("exito al registrar item");  
            showDefault("item registrado correctamente", "green")
        }
    } catch (error) {
        console.log("error al registrar cliente" , error);
        showDefault("algo salio mal 😔", "red")
    }
    finally{
        loading.value = false
    }
}

function showDefault(message, color) {
  $q.notify({
    message: message,
    timeout: 100,
    color: color
  })
}

function eliminarSeparadores(valor) {
    return Number(String(valor).replace(/[\.%]/g, '').trim());
}

async function getTributes() {
    try {
        const response = await getDataFactus("/v1/tributes/products?name=")
        tributes.value = response.data
    } catch (error) {
        console.log("error when bringing taxes", error);
    }
}

async function GetUnitsOfMeasure() {
    try {
        const response = await getDataFactus("/v1/measurement-units");
        unitsOfMeasure.value = response.data;
    } catch (error) {
        console.log("failure when bringing units of measure", error);
    }
}



onMounted(() => {
    GetUnitsOfMeasure(),
        getTributes()
})

</script>