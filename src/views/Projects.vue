<script setup>
import HogwartsProjectParallax from "../components/parallax/HogwartsProjectParallax.vue";
import {useProjectStore} from "@/stores/store-projects";
import {useUiStore} from "@/stores/store-ui";
import FlipProjectCard from "@/components/cards/FlipProjectCard.vue";
import {ref} from "vue";

const project = useProjectStore();
const ui = useUiStore();
const hoveredProject = ref(null);

const handleProjectHover = (proj) => {
    hoveredProject.value = proj;
};

const handleProjectLeave = () => {
    hoveredProject.value = null;
};
</script>

<template>
    <v-main>
        <HogwartsProjectParallax/>
        <div class="projects-container" :class="{'project-hovered': hoveredProject}">
            <div v-if="hoveredProject" class="project-background">
                <v-img
                    :src="hoveredProject.image"
                    cover
                    class="background-image"
                ></v-img>
            </div>
            <v-container class="mt-md-5">
                <h2 class="my-6 text-h5 text-sm-h5 text-md-h4 text-lg-h4">
                    {{ project.content.title }}
                </h2>
                <p class="my-5 text-body-1 text-sm-h6 text-md-h6 text-lg-h6"
                   v-for="description in project.content.description"
                   :key="description"
                   :class="{
                        'text-grey-lighten-1': ui.getTheme === 'dark',
                        'text-grey-darken-1': ui.getTheme === 'light'
                   }"
                >
                    {{ description }}
                </p>
                
                <!-- Projects Grid -->
                <v-row class="projects-grid">
                    <v-col cols="12" sm="6" md="4" v-for="proj in project.getProjects" :key="proj.id">
                        <div 
                            @mouseenter="handleProjectHover(proj)"
                            @mouseleave="handleProjectLeave"
                            class="project-card-wrapper"
                        >
                            <flip-project-card :repo="proj"/>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </v-main>
</template>

<style scoped>
.projects-container {
    position: relative;
    transition: all 0.5s ease;
    padding-bottom: 2rem;
}

.project-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.project-hovered .project-background {
    opacity: 0.1;
}

.background-image {
    width: 100%;
    height: 100%;
    filter: blur(8px);
    transform: scale(1.1);
}

.projects-grid {
    margin-top: 2rem;
    position: relative;
    z-index: 1;
}

.project-card-wrapper {
    height: 100%;
    display: block;
    margin-bottom: 16px;
}
</style>