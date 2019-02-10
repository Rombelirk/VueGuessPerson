
import Login from "./components/Login";
import VueRouter from "vue-router";

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/login', component: Login} ,
        // {path: '/', redirect: '/login'},
    ] 
    
    
})


export default router;
