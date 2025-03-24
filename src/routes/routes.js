// traer componentes mas tarde
import login from '../views/login.vue'
import home from '../views/home.vue';
import facturas from '../views/facturas.vue';
import crearFactura from '../views/crearFactura.vue';
import bienvenida from '../views/bienvenida.vue';
import items from '../views/items.vue';
import usuarios from '../views/usuarios.vue';

import { createRouter, createWebHashHistory } from "vue-router";


const routes =[
    {path:"/", component:login},
    {path:"/home", component:home,
        children:[
            {path:"", component:facturas},
            {path:"/crearFactura", component:crearFactura},
            {path:"/usuarios", component:usuarios},
            {path:"/items", component:items}
        ]
    }
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
});