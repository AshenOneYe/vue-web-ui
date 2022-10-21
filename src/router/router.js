const { createRouter, createWebHashHistory } = require("vue-router")

const routes = [
    {
        path:"/",
        name:"home",
        component:()=>import(/*webpackChunkName:'home'*/ '@/page/home.vue'),
        redirect:"overview",
        children:[
            {
                path:"overview",
                name:"overview",
                component:()=>import(/*webpackChunkName: 'overview'*/ '@/page/overview/overview.vue')
            },
            {
                path:"system-service",
                name:"system-service",
                component:()=>import(/*webpackChunkName: 'overview'*/ '@/page/system-service/system-service.vue')
            },
            {
                path:"syscall",
                name:"syscall",
                component:()=>import(/*webpackChunkName: 'overview'*/ '@/page/syscall/syscall.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router