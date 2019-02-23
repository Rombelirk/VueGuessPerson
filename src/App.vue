<template>
    <div class="main">
        <header-component/>
        <router-view/>
    </div>
</template>

<script>
import Header from "./components/Header.vue";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
    name: "App",
    components: {
        HeaderComponent: Header
    },
    methods: {
        ...mapActions({
            fetchInitialInfo: "fetchInitialInfo"
        }),
        ...mapMutations({
            changePlayersCount: "changePlayersCount"
        })
    },
    computed: {
        ...mapState({
            playersOnline: state => state.main.playersOnline,
            socket: state => state.main.socket
        })
    },
    created() {
        this.fetchInitialInfo();
        
      
    }
};
</script>

<style lang="scss">
@import "~@/assets/styles/defaults.scss";


.main {
    max-width: 1200px;
    height: 100%;
    margin: auto;
}
</style>
