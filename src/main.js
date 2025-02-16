import { createApp } from 'vue'
//quasar
import { Notify, Quasar } from 'quasar'

//vue-router
import {router} from './routes/routes.js'

//pinia
import { createPinia } from 'pinia'

//pinia - plugin persistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

//quasar
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

//estilos
import './style.css'




import App from './App.vue'
const myApp = createApp(App);
const pinia =createPinia()
myApp.use(router);
myApp.use(pinia);
pinia.use(piniaPluginPersistedstate)

myApp.use(Quasar, {
    plugins: {
      Notify,
    }, // import Quasar plugins and add here
  })

myApp.mount("#app");