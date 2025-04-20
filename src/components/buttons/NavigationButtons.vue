<script setup>
import ToggleDarkModeSwitch from "./ToggleDarkModeSwitch.vue";
import {useProfileStore} from "@/stores/store-profile";
import {useHomeStore} from "@/stores/store-home";
import {useProjectStore} from "@/stores/store-projects";
import {useContactStore} from "@/stores/store-contact";
import {useUiStore} from "@/stores/store-ui";
import HedwigsButton from "@/components/buttons/HedwigsButton.vue";
import { ref } from 'vue';

const profile = useProfileStore();
const home = useHomeStore();
const project = useProjectStore();
const contact = useContactStore();
const ui = useUiStore();

// Handle button hover
const handleButtonHover = (buttonType) => {
  const dobby = document.querySelector('.dobby-assistant');
  if (dobby) {
    const event = new CustomEvent('dobbyButtonHover', { detail: { buttonType } });
    dobby.dispatchEvent(event);
  }
};

// Handle button leave
const handleButtonLeave = () => {
  const dobby = document.querySelector('.dobby-assistant');
  if (dobby) {
    dobby.dispatchEvent(new CustomEvent('dobbyButtonLeave'));
  }
};
</script>

<template>
    <hedwigs-button @mouseenter="handleButtonHover('music')" @mouseleave="handleButtonLeave"/>
    <v-btn
        class="button bl"
        :class="{
            'button-dark': ui.getTheme === 'dark',
            'button-light': ui.getTheme === 'light'
        }"
        :exact="true"
        :ripple="false"
        stacked
        :to="`/${home.slug}`"
        @mouseenter="handleButtonHover('home')"
        @mouseleave="handleButtonLeave">
        {{ home.component }}
    </v-btn>
    <v-btn
        class="button bl"
        :class="{
            'button-dark': ui.getTheme === 'dark',
            'button-light': ui.getTheme === 'light'
        }"
        :exact="true"
        :ripple="false"
        stacked
        :to="`/${project.slug}`"
        @mouseenter="handleButtonHover('projects')"
        @mouseleave="handleButtonLeave">
        {{ project.component }}
    </v-btn>
    <v-btn
        class="button br bl"
        :class="{
            'button-dark': ui.getTheme === 'dark',
            'button-light': ui.getTheme === 'light'
        }"
        :ripple="false"
        stacked
        :to="`/${contact.slug}`"
        @mouseenter="handleButtonHover('contact')"
        @mouseleave="handleButtonLeave">
        {{ contact.component }}
    </v-btn>
    <v-btn
        stacked
        :ripple="false"
        @mouseenter="handleButtonHover('theme')"
        @mouseleave="handleButtonLeave">
       <toggle-dark-mode-switch/>
    </v-btn>
    <v-btn
        :href="profile.social.github"
        :ripple="false"
        class="social-button"
        :class="{
            'text-grey-lighten-1 social-button-dark': ui.getTheme === 'dark',
            'text-grey-darken-1 social-button-light': ui.getTheme === 'light'
        }"
        target="_blank"
        icon="mdi-github"
        @mouseenter="handleButtonHover('github')"
        @mouseleave="handleButtonLeave"/>
    <v-btn
        :href="profile.social.facebook"
        :ripple="false"
        class="social-button"
        :class="{
            'text-grey-lighten-1 social-button-dark': ui.getTheme === 'dark',
            'text-grey-darken-1 social-button-light': ui.getTheme === 'light'
        }"
        target="_blank"
        icon="mdi-facebook"
        @mouseenter="handleButtonHover('social')"
        @mouseleave="handleButtonLeave"/>
    <v-btn
        :href="profile.social.twitter"
        :ripple="false"
        class="social-button"
        :class="{
            'text-grey-lighten-1 social-button-dark': ui.getTheme === 'dark',
            'text-grey-darken-1 social-button-light': ui.getTheme === 'light'
        }"
        target="_blank"
        icon="mdi-twitter"
        @mouseenter="handleButtonHover('social')"
        @mouseleave="handleButtonLeave"/>
    <v-btn
        :href="profile.social.linkedin"
        :ripple="false"
        class="social-button"
        :class="{
            'text-grey-lighten-1 social-button-dark': ui.getTheme === 'dark',
            'text-grey-darken-1 social-button-light': ui.getTheme === 'light'
        }"
        target="_blank"
        icon="mdi-linkedin"
        @mouseenter="handleButtonHover('social')"
        @mouseleave="handleButtonLeave"/>
</template>

<style scoped>
.bl {
    position: relative;
}

.bl::before {
    content: "";
    position: absolute;
    left: 0;
    top: 25%;
    height: 50%;
    border-left: 1px solid #343434;
}

.br {
    position: relative;
}

.br::before {
    content: "";
    position: absolute;
    right: 0;
    top: 25%;
    height: 50%;
    border-right: 1px solid #343434;
}

.button {
    transition: 0.3s;
}

.button-dark:hover {
    color: #00fa95;
}

.button-light:hover {
    color: #00bd6e;
}

.social-button {
    transition: 0.3s;
}

.social-button-dark:hover {
    color: white !important;
}

.social-button-light:hover {
    color: #000000 !important;
}
</style>