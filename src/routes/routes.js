// traer componentes mas tarde
import login from '../views/login.vue'
import home from '../views/home.vue';
import facturas from '../views/facturas.vue';
import crearFactura from '../views/crearFactura.vue';
import bienvenida from '../views/bienvenida.vue';

import { createRouter, createWebHashHistory } from "vue-router";


const routes =[
    {path:"/", component:login},
    {path:"/home", component:home,
        children:[
            {path:"", component:bienvenida},
            {path:"/facturas", component:facturas},
            {path:"/crearFactura", component:crearFactura}
        ]
    }
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
});