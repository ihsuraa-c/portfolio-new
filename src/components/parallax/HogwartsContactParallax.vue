<script setup>
import {useContactStore} from "@/stores/store-contact";
import {useUiStore} from "@/stores/store-ui";
import FloatingLights from "../effects/FloatingLights.vue";

const contact = useContactStore();
const ui = useUiStore();
</script>

<template>
    <v-parallax
        :src="contact.header.parallax.location"
        :height="$vuetify.display.smAndUp && $vuetify.display.smAndDown ? 500 :
                $vuetify.display.mdAndUp && $vuetify.display.mdAndDown ? 550 :
                $vuetify.display.lgAndUp && $vuetify.display.lgAndDown ? 600 : 620">
        <FloatingLights :count="16" :attraction-force="0.22" :responsive="true">
            <v-container class="d-flex flex-column fill-height justify-center align-center text-white">
                <h1 class="text-h3 text-sm-h2 mb-4 text-md-h1 text-shadow potter text-center">
                    {{ contact.header.title }}
                </h1>
                <p class="text-shadow text-subtitle-2 text-sm-subtitle-1 text-md-h5 my-3 my-sm-0 text-center"
                   :class="{
                    'text-grey-lighten-3': ui.getTheme === 'dark',
                    'text-grey-lighten-2': ui.getTheme === 'light'
                   }"
                >
                    {{ contact.header.subtitle }}
                </p>
            </v-container>
        </FloatingLights>
    </v-parallax>
</template>

<style scoped>

</style>