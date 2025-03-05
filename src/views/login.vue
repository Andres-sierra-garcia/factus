<template>
 <div class="containerLogin">
        <div class="image"></div>
        <div class="form">
            <h3>Iniciar Sesion</h3>
            <p>Accede a tu cuenta para disfrutar de todas nuestras funciones.</p>
            <!--boton email-->
            <input v-model="email"  placeholder="Email address" class="input" type="email" />
            
            <!--boton password-->
            <input v-model="password"  class="input" type="password" placeholder="password">
        
           <!--  <button class="button" @click="iniciarSesion">
                
            Iniciar Sesion
            </button> -->
            <q-btn @click="login()" id="btnLoading" :loading="loading"  color="secondary"  label="Iniciar sesion"  />
        </div>
    </div>
    
      


</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '../stores/tienda';
import { router } from '../routes/routes';
const store = useStore();
import { postDataFactus } from '../services/factus.js';
const loading = ref(false)

//credenciales
let email= ref("")
let password = ref("")

async function login (){
    loading.value=true
    try {
        const response = await postDataFactus("/oauth/token",{
            grant_type:"password",
            client_id:import.meta.env.VITE_CLIENT_ID,
            client_secret:import.meta.env.VITE_CLIENT_SECRET,
            username:email.value,
            password:password.value
        })
            store.set_Token_RefreshToken(response.access_token, response.refresh_token)
            router.replace("/home")
    } catch (error) {
        console.log(error);
    }
    finally{
        loading.value=false
    }
}





</script>


<style >@import "../styles/login.css"</style>
