<template>
    <q-page class="q-pa-md">
        <h1>bienvenido, <span class="username">{{ username }}</span></h1>
        <p class="text-body1 text-grey-9 text-center">Simplifica y agiliza tu facturación con nuestra plataforma. Genera, gestiona y consulta tus facturas de manera rápida y segura. ¡Comienza ahora y lleva el control de tus transacciones sin complicaciones!</p>
        <q-btn @click="showModal = true" style="background-color: white; margin-left: 5%;"> registrar cliente</q-btn>
        <q-dialog v-model="showModal" class="bg-secundary ">
            <q-card style="width: 70%;">
                <q-card-section>
                    <h6>Datos del cliente</h6>
                </q-card-section>
                <q-form class="formCustomer" @submit="registerCustomer()">
                        <q-input class="inputCustomer" label="Identificación" v-model="customer.identification" required />
                        <q-input class="inputCustomer" label="DV" v-model="customer.dv" required />
                        <q-input class="inputCustomer" label="Empresa(opcional)" v-model="customer.company" />
                        <q-input class="inputCustomer" label="Nombre Comercial" v-model="customer.trade_name" />
                        <q-input class="inputCustomer" label="Nombres" v-model="customer.names" required />
                        <q-input class="inputCustomer" label="Dirección" v-model="customer.address" required />
                        <q-input class="inputCustomer" label="Correo Electrónico" v-model="customer.email" required type="email" />
                        <q-input class="inputCustomer" label="Teléfono" v-model="customer.phone" required type="tel" />
                        <q-input class="inputCustomer" label="ID Organización Legal" v-model="customer.legal_organization_id" required />
                        <q-input class="inputCustomer" label="ID Tributo" v-model="customer.tribute_id" required />
                        <q-input class="inputCustomer" label="ID Documento de Identificación" v-model="customer.identification_document_id" required />
                        <q-input class="inputCustomer" label="ID Municipio" v-model="customer.municipality_id" required />
                        <q-btn type="submit" class="button-center">Registrar</q-btn>
                </q-form>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '../stores/tienda';

const store = useStore()
const username = store.username

let showModal = ref(false)
const customer = ref({})

async function registerCustomer (){
    console.log("siii");
}

</script>

<style scoped>
@import '../styles/bienvenida.css'
</style>