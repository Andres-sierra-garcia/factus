<template>
    <q-layout view="hHh lpR fFf">
        <q-header style="">
            <q-toolbar>
                <q-btn icon="menu" @click="drawer = !drawer"></q-btn>
                <q-toolbar-title>
                    Factus
                </q-toolbar-title>
                <q-space /> <!--esto empuje los elementos siguientes hacia la derecha-->
                <q-btn icon="logout"  @click="CerrarSesion()">Cerrar Sesion</q-btn>
            </q-toolbar>
        </q-header>

        <!--menu lateral-->
        <q-drawer v-model="drawer" show-if-above @click-outside="drawer = !drawer">
            <q-list>
                <q-item clickable v-ripple to="/home">
                    <q-item-section avatar>
                        <q-icon name="home"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Inicio</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/facturas">
                    <q-item-section avatar>
                        <q-icon name="receipt"></q-icon>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Facturas</q-item-label>
                    </q-item-section>
                </q-item>

            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
const router = useRouter()
let drawer = ref(false)
const $q = useQuasar();

function CerrarSesion (){
    localStorage.removeItem("tienda")
    $q.notify({
    type: 'positive',
    message: 'Sesión cerrada correctamente',
  });
  router.push("/")
}

</script>