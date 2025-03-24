<template>
    <q-page class="q-pa-md">
        <h2>Crear factura</h2>
        <q-card>
            <q-card-section class="container">
                <q-card-section class="customer">
                    <h5>Datos del cliente</h5>
                    <q-card-section class="flex q-gutter-lg">


                        <q-select clearable v-model="factura.customer" type="number" :options="customers"
                            label="Documento" option-label="identification" behavior="menu" use-input input-debounce="0"
                            @filter="filterFn" style="width: 200px;" />


                        <q-input id="nombre" disable :model-value="factura.customer?.names || ' '"
                            label="Nombre"></q-input>
                        <q-input id="nombre" disable :model-value="factura.customer?.email || ' '"
                            label="Email"></q-input>
                        <q-input id="nombre" disable :model-value="factura.customer?.phone || ' '"
                            label=Telefono></q-input>
                        <q-input id="nombre" disable :model-value="factura.customer?.address || ' '"
                            label="Direccion"></q-input>
                        <!--<q-input id="nombre" disable :model-value="factura.customer?.identification_document_id ? documentos[factura.customer.identification_document_id] : ' '" label="tipo de documento"></q-input> -->
                    </q-card-section>
                </q-card-section>
                <hr>

                <q-card-section class="invoice">
                    <h5>Datos de factura</h5>
                    <q-card-section class="flex q-gutter-xl">
                        <q-input v-model="factura.reference_code" label="codigo de referencia" type="text"></q-input>

                        <q-select v-model="factura.numbering_range_id" option-value="id" emit-value
                            :options="numberingRanges" label="tipo de documento" option-label="document" behavior="menu"
                            map-options style="width: 200px;" />


                        <q-input v-model="factura.observation" label="observaciones" type="text"></q-input>

                        <q-select v-model="factura.payment_form" :options="metodosPago" option-value="id" emit-value
                            map-options label="forma de pago" option-label="nombre" style="width: 160px;" />

                        <q-select v-model="factura.payment_method_code" :options="mediosPago" option-value="id"
                            emit-value map-options label="Metodo de pago" option-label="nombre" style="width: 160px;" />

                        <q-input v-model="factura.payment_due_date" label="vencimiento factura" type="date"
                            style="width: 160px;"></q-input>

                    </q-card-section>

                    <h6 style="background-color: white;">Periodo de facturacion</h6>
                    <q-card-section>
                        <q-card-section class="flex q-gutter-xl">
                            <q-input v-model="factura.billing_period.start_date" label="fecha de inicio" type="date"
                                outlined></q-input>
                            <q-input v-model="factura.billing_period.start_time" type="time" label="hora de inicio"
                                outlined></q-input>
                            <q-input v-model="factura.billing_period.end_date" label="fecha de fin" type="date"
                                outlined></q-input>
                            <q-input v-model="factura.billing_period.end_time" type="time" label="hora de fin"
                                filled></q-input>
                        </q-card-section>
                    </q-card-section>

                </q-card-section>

                <hr>
                <q-card-section>
                    <h5>Items</h5>
                    <q-select v-model="itemSelected" :options="selectItems" label="Seleccionar" option-label="name"
                        @update:model-value="agregarItem" dense filled behavior="menu"
                        style="width: 200px; margin-bottom: 3%;" />
                    <q-table flat bordered separator="cell" :rows="factura.items" :columns="columnsItems"
                        row-key="name">

               <!--          <template v-slot:body-cell-withholding_taxes="props">
                            <q-td :props="props">
                                <div v-for="(tax, index) in item.withholding_taxes" :key="index">
                                    <q-input v-model="tax.code" label="Código de Retención" filled required />
                                    <q-input v-model="tax.withholding_tax_rate" label="Tasa de Retención" filled
                                        required />
                                </div>
                            </q-td>
                        </template> -->

                        <template v-slot:body-cell-quantity="props">
                            <q-td :props="props">
                                <q-input type="number" label="cantidad" :model-value="props.row?.quantity || ''"
                                    @update:model-value="value => props.row.quantity = Number(value)"></q-input>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-options="props">
                            <q-td :props="props">
                                <q-btn @click="deleteProduct(props.row)" icon="delete"></q-btn>
                            </q-td>
                        </template>
                    </q-table>
                </q-card-section>

                <q-card-section>
                    <q-btn @click="crearFactura()" style="background-color: var(--secundary-color); color: white;"
                        :loading="loading">crear factura</q-btn>
                </q-card-section>

            </q-card-section>
        </q-card>

    </q-page>
</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { getData, postData } from '../services/apiclient.js';
import { getDataFactus } from '../services/factus.js';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const loading = ref(false)
const itemSelected = ref("")
const selectItems = ref()
const customers = ref([])
const numberingRanges = ref([])
//datos factura
const factura = ref({
    billing_period: {},
    items: []
})

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
    },/* {
        name:"withholding_taxes",
        align:"center",
        label:"retenciones",
    }, */
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
    },
    {
        name: "options",
        align: "center",
    }
]);



const documentos = {
    1: "Registro civil",
    2: "Tarjeta de identidad",
    3: "Cédula de ciudadanía",
    4: "Tarjeta de extranjería",
    5: "Cédula de extranjería",
    6: "NIT",
    7: "Pasaporte",
    8: "Documento de identificación extranjero",
    9: "PEP",
    10: "NIT otro país",
    11: "NUIP*"
};

const mediosPago = [
    { id: 10, nombre: "Efectivo" },
    { id: 42, nombre: "Consignación" },
    { id: 20, nombre: "Cheque" },
    { id: 47, nombre: "Transferencia" },
    { id: 71, nombre: "Bonos" },
    { id: 72, nombre: "Vales" },
    { id: 1, nombre: "Medio de pago no definido" },
    { id: 49, nombre: "Tarjeta Débito" },
    { id: 48, nombre: "Tarjeta Crédito" }
];

const metodosPago = [
    { id: 1, nombre: "Pago de contado" },
    { id: 2, nombre: "Pago a crédito" }
];

function deleteProduct(product) {
    const index = factura.value.items.indexOf(product); // Encuentra el índice del producto
    if (index !== -1) {
        factura.value.items.splice(index, 1); // Elimina el producto del array
    }
}

async function getCustomers() {
    try {
        const response = await getData("/customer/customers")
        customers.value = response.customers
    } catch (error) {
        console.log("error al traer clientes", error);
    }
}

async function filterFn(val, update) {
    if (val === '') {
        update(() => {
            getCustomers(); // Mostrar todos si el campo está vacío
        });
        return;
    }

    const needle = val.toLowerCase();
    update(() => {
        customers.value = customers.value.filter(v => v.names.toLowerCase().includes(needle) || v.identification.includes(needle));
    });
}

function showDefault(message, color) {
    $q.notify({
        message: message,
        timeout: 100,
        color: color
    })
}


async function crearFactura() {
    loading.value = true;
    try {
        const response = await postData("/invoice", {
            numbering_range_id: Number(factura.value.numbering_range_id),
            reference_code: factura.value.reference_code,
            observation: factura.value.observation,
            payment_form: factura.value.payment_form,
            payment_due_date: factura.value.payment_due_date,
            /*       payment_due_date: "2024-12-30", */
            payment_method_code: factura.value.payment_method_code,
            billing_period: {
                start_date: factura.value.billing_period.start_date,
                start_time: factura.value.billing_period.start_time + ":00",
                end_date: factura.value.billing_period.end_date,
                end_time: factura.value.billing_period.end_time + ":00"
                /*  start_date: "2024-01-10",
                 start_time: "00:00:00",
                 end_date: "2024-02-09",
                 end_time: "23:59:59" */
            },
            customer: toRaw(factura.value.customer),
            items: factura.value.items.map((item) => toRaw(item)),
            state: 1
        })

        showDefault("Factura valida correctamente", "green")
        console.log("factura validada", response);

    } catch (error) {
        showDefault("Error al validar factura", "red")
        console.log(
            "error al enviar datos de factura", error
        );
    } finally {
        loading.value = false;
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
        const item = { ...itemSelected.value }
        factura.value.items.push(item);
    }
}

async function getNumberingRanges() {
    try {
        const ranges = await getDataFactus("/v1/numbering-ranges?filter[id]&filter[document]&filter[resolution_number]&filter[technical_key]&filter[is_active]")
        console.log(ranges.data);
        numberingRanges.value = ranges.data
    } catch (error) {
        console.log("error al traer rangos", error);
    }

}



//tabla

onMounted(() => {
    getItems(),
        getCustomers(),
        getNumberingRanges()
})

</script>

<!-- <style scoped>
@import "../styles/crearFactura.css";
</style> -->