import Vue from 'vue'
import VueRouter from 'vue-router'
import jwt_decode from "jwt-decode";

Vue.use(VueRouter);


// const requireAuth = () => (from, to, next) => {
//     const token = Vue.cookie.get('x-access-token')
//     if (token !== null) {
//         if (jwt_decode(token).iss !== "ajou-hci-server") return next('/login')
//         else return next();
//     } else {
//         return next('/login')
//     }
// };


const routes = [
    {
        path: '/main',
        name: 'Main',
        // beforeEnter: requireAuth(),
        component: () => import('../views/Main'),
    },
    // {
    //     path: '/login',
    //     name: 'login',
    //     component: () => import('@/views/Login.vue'),

    // },
    // {
    //     path: '/join',
    //     name: 'join',
    //     component: () => import('@/views/Join'),

    // },
    {
        path: '*',
        redirect: '/main'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
