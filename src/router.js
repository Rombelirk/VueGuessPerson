
import Login from "./components/Login";
import Game from "./components/Game";
import Upload from "./components/Upload/Upload";
import VueRouter from "vue-router";

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/login', component: Login} ,
        {path: '/upload', component: Upload} ,
        {path: '/', component: Game},
    ] 
    
    
})


export default router;
