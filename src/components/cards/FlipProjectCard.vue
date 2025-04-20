<script setup>
import { useUiStore } from "@/stores/store-ui";
import { ref, onMounted } from 'vue';

const ui = useUiStore();
const imageLoaded = ref(false);
const imageUrl = ref('');
const isFlipped = ref(false);
const isMobile = ref(false);

const props = defineProps({
  repo: {
    type: Object,
    required: true
  }
});

onMounted(() => {
  // Check if image exists
  if (props.repo.image) {
    const img = new Image();
    img.onload = () => {
      imageLoaded.value = true;
      imageUrl.value = props.repo.image;
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${props.repo.image}`);
      imageLoaded.value = false;
    };
    img.src = props.repo.image;
  }
  
  // Check if mobile
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

const checkMobile = () => {
  isMobile.value = window.innerWidth < 600;
};

const toggleFlip = () => {
  if (isMobile.value) {
    isFlipped.value = !isFlipped.value;
  }
};

const openProject = (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (props.repo.url) {
    window.open(props.repo.url, '_blank');
  }
};
</script>

<template>
  <div 
    class="flip-card" 
    :class="{'mobile-flipped': isFlipped && isMobile}"
    @click="toggleFlip"
  >
    <div class="flip-card-inner">
      <!-- Front of the card -->
      <div class="flip-card-front">
        <div v-if="imageLoaded" class="image-card">
          <img :src="imageUrl" :alt="repo.name" class="project-image">
          <div class="image-overlay"></div>
          <div class="project-title-overlay">
            <h3 class="text-h5 project-title">{{ repo.name }}</h3>
          </div>
        </div>
        <div v-else class="project-card-design">
          <v-icon size="64" color="primary" class="project-icon">mdi-code-braces</v-icon>
          <h3 class="text-h5 project-title mt-4">{{ repo.name }}</h3>
          <div class="language-tag mt-2">
            <v-chip
              size="small"
              :color="repo.language === 'Vue' ? 'green-accent-3' :
                      repo.language === 'Java' ? 'red' :
                      repo.language === 'Python' ? 'blue' :
                      repo.language === 'JavaScript' ? 'amber' : ''"
            >
              <v-icon start size="x-small">mdi-circle</v-icon>
              {{ repo.language }}
            </v-chip>
          </div>
        </div>
      </div>
      
      <!-- Back of the card -->
      <div class="flip-card-back">
        <div class="card-content">
          <h3 class="text-h5 mb-4">{{ repo.name }}</h3>
          <p class="text-body-1 mb-4 description-text">{{ repo.description }}</p>
          <div class="tech-stack">
            <v-chip
              v-for="tag in repo.tags"
              :key="tag"
              class="ma-1"
              color="primary"
              variant="outlined"
              size="small"
            >
              {{ tag }}
            </v-chip>
            <v-chip
              class="ma-1"
              size="small"
              :color="repo.language === 'Vue' ? 'green-accent-3' :
                      repo.language === 'Java' ? 'red' :
                      repo.language === 'Python' ? 'blue' :
                      repo.language === 'JavaScript' ? 'amber' : ''"
            >
              <v-icon start size="x-small">mdi-circle</v-icon>
              {{ repo.language }}
            </v-chip>
          </div>
          <v-btn
            class="mt-4"
            color="primary"
            @click="openProject"
            variant="outlined"
            size="small"
          >
            View Project
            <v-icon end>mdi-open-in-new</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <div v-if="isMobile" class="tap-hint">
      <v-icon size="small" color="white" v-if="!isFlipped">mdi-gesture-tap</v-icon>
      <span v-if="!isFlipped">Tap to see details</span>
      <v-icon size="small" color="white" v-if="isFlipped">mdi-gesture-tap</v-icon>
      <span v-if="isFlipped">Tap to go back</span>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  background-color: transparent;
  width: 100%;
  height: 300px;
  perspective: 1000px;
  margin-bottom: 1rem;
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* For non-mobile hover */
@media (hover: hover) and (pointer: fine) {
  .flip-card:hover {
    transform: translateY(-15px);
  }
  
  .flip-card:hover .flip-card-inner {
    transform: rotateX(180deg) rotateY(180deg);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
  }
  
  .flip-card:hover .flip-card-front {
    visibility: hidden;
    transition: visibility 0s 0.4s;
  }
  
  .flip-card:hover .flip-card-back {
    background: linear-gradient(135deg, var(--v-theme-surface-variant) 0%, var(--v-theme-surface) 100%);
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.4);
  }
  
  .tap-hint {
    display: none;
  }
}

/* For mobile devices - click to flip */
.mobile-flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.mobile-flipped .flip-card-front {
  visibility: hidden;
  transition: visibility 0s 0.4s;
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.flip-card-front {
  background: linear-gradient(135deg, var(--v-theme-surface) 0%, var(--v-theme-surface-variant) 100%);
  color: var(--v-theme-on-surface);
  transform: rotateX(0deg) rotateY(0deg);
  z-index: 2;
  transition: all 0.3s ease;
}

.flip-card-back {
  background: linear-gradient(135deg, var(--v-theme-surface-variant) 0%, var(--v-theme-surface) 100%);
  color: var(--v-theme-on-surface);
  transform: rotateX(180deg) rotateY(180deg);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.image-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.project-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.project-card-design {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 20px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.project-card-design::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    0deg,
    transparent,
    transparent,
    #3498db,
    #3498db,
    #3498db
  );
  transform-origin: bottom right;
  animation: rotate 6s linear infinite;
  opacity: 0.1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.project-icon {
  color: #3498db;
  filter: drop-shadow(0 0 8px rgba(52, 152, 219, 0.4));
  margin-bottom: 10px;
}

.project-title {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  font-weight: 600;
  color: white;
  position: relative;
  z-index: 2;
}

.language-tag {
  margin-top: 15px;
  position: relative;
  z-index: 2;
}

.card-content {
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  overflow-y: auto;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.875rem;
}

.tap-hint {
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 0.75rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  z-index: 3;
  border-radius: 0 0 8px 8px;
}

/* Fix for Safari and iOS */
@supports (-webkit-touch-callout: none) {
  .flip-card-front,
  .flip-card-back,
  .flip-card-inner {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }
}

@media (max-width: 600px) {
  .flip-card {
    height: 280px;
  }
  
  .project-icon {
    font-size: 48px;
  }
  
  .project-title {
    font-size: 1.2rem;
  }
  
  .card-content {
    padding: 10px;
  }
  
  .description-text {
    -webkit-line-clamp: 2;
    font-size: 0.8rem;
  }
}
</style> 