<template>
    <div class="upload">
        <div class="title">Person upload</div>
        <img class="preview" :src="image">
        <label>
            <input hidden type="file" @change="onFileUpload">
            <base-button>Choose file</base-button>
        </label>
        <div>
            <div class="upload-title">Name</div>
            <text-input :value="name" :change="onNameChange" :title="'Name'"/>
        </div>
        <div>
            <div class="upload-title">Wiki url</div>
            <text-input :value="wikiUrl" :change="onWikiUrlChange" :title="'Wiki Url'"/>
        </div>
        <base-button :click="onPersonSubmit">Send</base-button>
    </div>
</template>

<script>
import Button from "../Button";
import TextInput from "../TextInput";
import { mapActions } from "vuex";
export default {
    name: "Upload",
    components: {
        BaseButton: Button,
        TextInput
    },
    data() {
        return {
            name: "",
            wikiUrl: "",
            image: "",
            imageFile: undefined
        };
    },
    methods: {
        onFileUpload(e) {
            this.imageFile = e.target.files[0];
            const fr = new FileReader();
            fr.onload = e => (this.image = e.target.result);
            fr.readAsDataURL(this.imageFile);
        },
        onNameChange(value) {
            this.name = value;
        },
        onWikiUrlChange(value) {
            this.wikiUrl = value;
        },
        onPersonSubmit() {
            if (!this.name) {
                return this.addUserAlertWithTimer({
                    type: "error",
                    text: "Name is not specified!"
                });
            }
            if (!this.wikiUrl) {
                return this.addUserAlertWithTimer({
                    type: "error",
                    text: "Wiki url is not specified!"
                });
            }
            if (!this.imageFile) {
                return this.addUserAlertWithTimer({
                    type: "error",
                    text: "No image file uploaded!"
                });
            }
            this.sendPerson({
                name: this.name,
                wikiUrl: this.wikiUrl,
                image: this.imageFile
            });
        },
        ...mapActions({
            sendPerson: "sendPerson",
            addUserAlertWithTimer: "addUserAlertWithTimer"
        })
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.upload {
    display: flex;
    flex-direction: column;
    margin: 10px;
    max-width: 200px;
    .upload-title {
        font-size: 1.1em;
    }
    & > * {
        margin: 10px;
    }
    .preview {
        max-width: 100px;
    }
}
</style>
