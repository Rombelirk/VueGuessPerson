
import Login from "./components/Login";
import Game from "./components/Game";
import VueRouter from "vue-router";

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/login', component: Login} ,
        {path: '/', component: Game},
    ] 
    
    
})


export default router;
