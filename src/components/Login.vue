<template>
    <div class="login-form-container">
        <div class="login-form">
            <div class="title">Login</div>
            <text-input :value="login" :title="'login'" :change="onFieldInput" type="text"/>
            <div class="title">Password</div>
            <text-input :value="password" :title="'password'" :change="onFieldInput" type="text"/>
            <div class="buttons-container">
                <base-button :click="onLoginSubmit">Login</base-button>
                <base-button :click="onSignupSubmit">Signup</base-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import TextInput from "./TextInput";
import Button from "./Button";
export default {
    name: "Login",
    data() {
        return {
            login: "",
            password: ""
        };
    },
    components: {
        TextInput,
        BaseButton: Button
    },
    methods: {
        onFieldInput(value, title) {
            if (title === "login") {
                this.login = value;
            } else {
                this.password = value;
            }
        },

        onLoginSubmit() {
            this.submitLogin({ login: this.login, password: this.password });
        },
        onSignupSubmit() {
            this.submitSignup({ login: this.login, password: this.password });
        },
        ...mapActions({
            submitLogin: "submitLogin",
            submitSignup: "submitSignup"
        })
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.login-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    .login-form {
        width: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border: 1px solid rgb(204, 204, 204);
        border-radius: $border-radius;
        padding: $base-gutter $base-gutter * 3;
        /* background-color: $block-background-color;
        box-shadow: $box-shadow; */
        .buttons-container {
            display: flex;
            justify-content: space-around;
            margin: 10px;
            & > * {
                margin: 5px;
            }
        }

        .submit {
            height: 20px;
            width: 60px;
            background-color: gray;
            color: white;
        }
    }
}
</style>
