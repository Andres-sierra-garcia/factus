<template>
    <q-page class="q-pa-md">

        <q-card class="q-pa-md">
            <h5>cliente</h5>
            <q-select v-model="factura.customer" :options="customers" label="Seleccionar" 
            option-label="names" dense filled behavior="menu" style="width: 200px;" />

            <hr>
            <h5>Datos factura</h5>
            <q-card-section class="row q-col-gutter-md">
                <q-select v-model="factura.numbering_range_id" option-value="id" emit-value :options="numberingRanges" label="tipo de documento" 
                option-label="document" dense filled behavior="menu"  style="width: 200px;" />
                <q-input v-model="factura.reference_code" label="codigo de referencia" type="text" outlined></q-input>
                <q-input v-model="factura.observation" label="observaciones" type="text" outlined></q-input>
                <q-input v-model="factura.payment_form" label="codigo de forma de pago" type="text" outlined></q-input>
                <q-input v-model="factura.payment_due_date" label="vencimiento factura" type="date" outlined></q-input>
                <!--cambiar el formato a año/mes/dia-->
                <q-input v-model="factura.payment_method_code" label="codigo de metodo de pago" type="text"
                    outlined></q-input>
            </q-card-section>
            <h5 class="text-center">periodo de facturacion</h5>
            <q-card-section class="row q-col-gutter-md">
                <q-input v-model="factura.billing_period.start_date" label="fecha de inicio" type="date"
                    outlined></q-input>
                <q-input v-model="factura.billing_period.start_time" label="hora de inicio" type="date"
                    outlined></q-input>
                <q-input v-model="factura.billing_period.end_date" label="fecha de fin" type="date" outlined></q-input>
                <q-input v-model="factura.billing_period.end_time" label="hora de fin" type="date" filled></q-input>
            </q-card-section>
            <h5 class="text-center">Items</h5>

            <q-select v-model="itemSelected" :options="selectItems" label="Seleccionar" 
            option-label="name"  @update:model-value="agregarItem"  dense filled behavior="menu"  style="width: 200px;" />

            <div class="q-pa-md">
                <q-table flat bordered :rows="factura.items" :columns="columnsItems" row-key="name">
                    <template v-slot:body-cell-quantity="props">
                        <q-td :props="props">
                            <q-input type="number" placeholder="cantidad" v-model="props.row.quantity"></q-input>
                        </q-td>
                    </template>
                </q-table>
            </div>
            <q-btn @click="crearFactura()">crear factura</q-btn>
        </q-card>


    </q-page>
</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { getData, postData } from '../services/apiclient.js';
import { getDataFactus } from '../services/factus.js';
const itemSelected = ref("")
const selectItems = ref()
const customers =ref("")
const numberingRanges = ref("")
//datos factura
const factura = ref({
    billing_period: {},
    items: []
})

async function getCustomers(){
    try {
        const response =await getData("/customer/customers")
        customers.value = response.customers
    } catch (error) {
        console.log("error al traer clientes", error);
    }
    
}
async function crearFactura(){
    try {
        const response = await postData("/invoice",{
            numbering_range_id:Number(factura.value.numbering_range_id),
            reference_code: factura.value.reference_code,
            observation:factura.value.observation,
            payment_form:factura.value.payment_form,
      /*    payment_due_date:factura.value.payment_method_code, */
            payment_due_date: "2024-12-30",
            payment_method_code:factura.value.payment_method_code,
            billing_period:{
                /* start_date:factura.value.billing_period.start_date,
                start_time:factura.value.billing_period.start_time,
                end_date:factura.value.billing_period.end_date,
                end_time:factura.value.billing_period.end_time */
                start_date:"2024-01-10",
                start_time:"00:00:00",
                end_date:"2024-02-09",
                end_time:"23:59:59"
            },
            customer:toRaw(factura.value.customer),
            items:factura.value.items.map((item)=> toRaw(item)),
            state:1
        })

        console.log("factura validada", response);
        
    } catch (error) {
        console.log(
            "error al enviar datos de factura", error
        );
    }
    
}


async function getItems() {
    try {
        const response = await getData("/item/items")
        selectItems.value = response.items
    } catch (error) {
        console.log("error-get-items", error);
    }

}

function agregarItem() {
    if (itemSelected) {
        const item = {...itemSelected.value}
        factura.value.items.push(item);
    }
}

async function getNumberingRanges(){
    try {
        const ranges = await getDataFactus("/v1/numbering-ranges?filter[id]&filter[document]&filter[resolution_number]&filter[technical_key]&filter[is_active]")
        console.log(ranges.data);
        numberingRanges.value = ranges.data
    } catch (error) {
        console.log("error al traer rangos", error);
    }
    
}



//tabla
const columnsItems = ref([
    {
        name: "code_reference",
        align: "center",
        label: "Codigo de referencia",
        field: "code_reference",
        sortable: true
    },
    {
        name: "name",
        align: "center",
        label: "Nombre",
        field: "name",
        sortable: true
    },
    {
        name: "quantity",
        align: "center",
        label: "Cantidad",
        field: "quantity",
        sortable: true
    },
    {
        name: "discount_rate",
        align: "center",
        label: "Tasa de Descuento",
        field: "discount_rate",
        sortable: true
    },
    {
        name: "price",
        align: "center",
        label: "Precio",
        field: "price",
        sortable: true
    },
    {
        name: "tax_rate",
        align: "center",
        label: "Tasa de Impuesto",
        field: "tax_rate",
        sortable: true
    },
    {
        name: "unit_measure_id",
        align: "center",
        label: "ID Unidad de Medida",
        field: "unit_measure_id",
        sortable: true
    },
    {
        name: "standard_code_id",
        align: "center",
        label: "ID Código Estándar",
        field: "standard_code_id",
        sortable: true
    },
    {
        name: "is_excluded",
        align: "center",
        label: "Excluido",
        field: "is_excluded",
        sortable: true
    },
    {
        name: "tribute_id",
        align: "center",
        label: "ID Tributo",
        field: "tribute_id",
        sortable: true
    }
]);


onMounted(() => {
    getItems(),
    getCustomers(),
    getNumberingRanges()
})

</script>

<!-- <style scoped>
@import "../styles/crearFactura.css";
</style> -->