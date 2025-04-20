<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useUiStore } from "@/stores/store-ui";

const ui = useUiStore();
const isPrimaryDark = computed(() => ui.getTheme === 'dark');

const testimonials = [
  {
    id: 1,
    name: 'Harshit Gautam',
    position: 'COO E-Cell IIITD',
    image: './images/wands.jpg',
    colorClass: 'primary',
    content: "Aarushi's design work for E-Cell has been transformative. Her ability to translate complex concepts into intuitive interfaces elevated our digital presence. Her portfolio showcases not just technical skill, but a deep understanding of user psychology that makes her designs truly exceptional."
  },
  {
    id: 2,
    name: 'Ayush Tiwari',
    position: 'CEO E-Cell IIITD',
    image: './images/wands.jpg',
    colorClass: 'secondary',
    content: "Working with Aarushi has been a game-changer for our organization. Her meticulous attention to detail and innovative approach to UI/UX challenges has significantly improved user engagement across our platforms. She consistently delivers designs that are both visually stunning and highly functional."
  },
  {
    id: 3,
    name: 'Bharti Bansal',
    position: 'CFO E-Cell IIITD',
    image: './images/wands.jpg',
    colorClass: 'accent',
    content: "Aarushi brings a magical touch to every project she handles. Her designs not only look beautiful but also drive measurable results. She has a rare talent for balancing aesthetics with analytics, understanding that great design must also support business objectives. An absolute wizard of design!"
  }
];

const activeIndex = ref(0);
const interval = ref(null);
const isHovering = ref(false);

const nextTestimonial = () => {
  activeIndex.value = (activeIndex.value + 1) % testimonials.length;
};

const prevTestimonial = () => {
  activeIndex.value = (activeIndex.value - 1 + testimonials.length) % testimonials.length;
};

const startAutoRotation = () => {
  clearInterval(interval.value);
  interval.value = setInterval(() => {
    if (!isHovering.value) {
      nextTestimonial();
    }
  }, 5000);
};

const stopAutoRotation = () => {
  clearInterval(interval.value);
};

const setHovering = (value) => {
  isHovering.value = value;
};

onMounted(() => {
  startAutoRotation();
  
  // Add window resize handler for better mobile support
  window.addEventListener('resize', handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  stopAutoRotation();
  window.removeEventListener('resize', handleResize);
});

// Adjust for mobile devices
const isMobile = ref(false);
const handleResize = () => {
  isMobile.value = window.innerWidth < 600;
};

// Add touch support for mobile
const touchStartX = ref(0);
const touchEndX = ref(0);

const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX;
  if (touchStartX.value - touchEndX.value > 50) {
    // Swipe left
    nextTestimonial();
  } else if (touchEndX.value - touchStartX.value > 50) {
    // Swipe right
    prevTestimonial();
  }
};
</script>

<template>
  <div class="testimonial-container my-12">
    <h3 class="wizard-title text-center mb-8">Pensieve of Praise</h3>
    <p class="wizard-subtitle text-center mb-10">~ Testimonium Revelio ~</p>
    
    <div 
      class="carousel-container"
      @mouseenter="setHovering(true)"
      @mouseleave="setHovering(false)"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div 
        class="carousel-track" 
        :style="{ 
          transform: isMobile 
            ? `translateZ(-150px) rotateY(${activeIndex * -120}deg)` 
            : `translateZ(-250px) rotateY(${activeIndex * -120}deg)` 
        }"
      >
        <div 
          v-for="(testimonial, index) in testimonials" 
          :key="testimonial.id"
          class="testimonial-card"
          :class="{ 'active': index === activeIndex }"
          :style="{ 
            transform: isMobile 
              ? `rotateY(${index * 120}deg) translateZ(150px)` 
              : `rotateY(${index * 120}deg) translateZ(250px)` 
          }"
        >
          <div class="testimonial-content" :class="`border-${testimonial.colorClass}`">
            <div class="testimonial-header">
              <div class="avatar-container" :class="testimonial.colorClass">
                <v-avatar size="60">
                  <v-img :src="testimonial.image" alt="Avatar" cover />
                </v-avatar>
              </div>
              <div class="person-info">
                <h4 class="person-name">{{ testimonial.name }}</h4>
                <p class="person-position text-grey">{{ testimonial.position }}</p>
              </div>
            </div>
            
            <div class="testimonial-body">
              <v-icon color="grey" size="24" class="quote-icon">mdi-format-quote-open</v-icon>
              <p class="testimonial-text">{{ testimonial.content }}</p>
              <v-icon color="grey" size="24" class="quote-icon-end">mdi-format-quote-close</v-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="testimonial-controls">
      <v-btn icon @click="prevTestimonial" variant="outlined" color="grey" class="control-btn">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <div class="testimonial-dots">
        <span 
          v-for="(dot, index) in testimonials" 
          :key="index"
          class="dot"
          :class="{ 'active': index === activeIndex, [testimonials[index].colorClass]: index === activeIndex }"
          @click="activeIndex = index"
        ></span>
      </div>
      <v-btn icon @click="nextTestimonial" variant="outlined" color="grey" class="control-btn">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pirata+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Tangerine:wght@700&display=swap');

.testimonial-container {
  position: relative;
  perspective: 1000px;
  padding: 20px 0 40px;
}

.wizard-title {
  font-family: 'Pirata One', cursive;
  font-size: 3.5rem;
  letter-spacing: 2px;
  color: var(--v-theme-primary);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  margin-bottom: 0.5rem;
}

.wizard-title::before,
.wizard-title::after {
  content: "⚡";
  font-size: 1.5rem;
  margin: 0 12px;
  vertical-align: middle;
  opacity: 0.8;
}

.wizard-subtitle {
  font-family: 'Tangerine', cursive;
  font-size: 2rem;
  color: var(--v-theme-secondary);
  opacity: 0.8;
  letter-spacing: 1px;
}

.carousel-container {
  position: relative;
  height: 350px;
  margin: 0 auto;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.carousel-track {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 1s ease;
}

.testimonial-card {
  position: absolute;
  width: 100%;
  max-width: 500px;
  height: 100%;
  left: 50%;
  transform-origin: center;
  transform-style: preserve-3d;
  transition: all 0.8s ease;
  opacity: 0.2;
  filter: blur(2px);
  margin-left: -250px;
}

.testimonial-card.active {
  opacity: 1;
  filter: blur(0);
  z-index: 10;
}

.testimonial-content {
  width: 100%;
  height: 100%;
  background: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-top: 5px solid transparent;
}

.border-primary {
  border-top-color: var(--v-theme-primary);
}

.border-secondary {
  border-top-color: var(--v-theme-secondary);
}

.border-accent {
  border-top-color: var(--v-theme-accent);
}

.testimonial-header {
  padding: 24px 24px 0;
  display: flex;
  align-items: center;
}

.avatar-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 3px solid transparent;
}

.primary {
  border-color: var(--v-theme-primary);
}

.secondary {
  border-color: var(--v-theme-secondary);
}

.accent {
  border-color: var(--v-theme-accent);
}

.person-info {
  flex: 1;
}

.person-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.person-position {
  font-size: 0.9rem;
  margin: 4px 0 0;
  opacity: 0.7;
  color: var(--v-theme-grey);
}

.testimonial-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.testimonial-text {
  font-size: 1rem;
  line-height: 1.6;
  flex: 1;
  padding: 0 8px;
  margin: 10px 0;
  position: relative;
  z-index: 1;
}

.quote-icon {
  align-self: flex-start;
  opacity: 0.5;
  margin-bottom: 8px;
  color: var(--v-theme-grey);
}

.quote-icon-end {
  align-self: flex-end;
  opacity: 0.5;
  margin-top: 8px;
  color: var(--v-theme-grey);
}

.testimonial-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.control-btn {
  margin: 0 12px;
}

.testimonial-dots {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  margin: 0 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  transform: scale(1.3);
}

.dot.primary {
  background-color: var(--v-theme-primary);
}

.dot.secondary {
  background-color: var(--v-theme-secondary);
}

.dot.accent {
  background-color: var(--v-theme-accent);
}

/* Media queries for responsive design */
@media (max-width: 960px) {
  .carousel-container {
    height: 400px;
  }
  
  .testimonial-card {
    max-width: 450px;
    margin-left: -225px;
  }
  
  .testimonial-text {
    font-size: 0.95rem;
  }
  
  .wizard-title {
    font-size: 2.8rem;
  }
  
  .wizard-subtitle {
    font-size: 1.8rem;
  }
}

@media (max-width: 600px) {
  .carousel-container {
    height: 450px;
  }
  
  .testimonial-card {
    max-width: 320px;
    margin-left: -160px;
  }
  
  .testimonial-text {
    font-size: 0.9rem;
  }
  
  .testimonial-header {
    padding: 20px 20px 0;
  }
  
  .testimonial-body {
    padding: 20px;
  }
  
  .avatar-container {
    width: 50px;
    height: 50px;
  }
  
  .wizard-title {
    font-size: 2.2rem;
  }
  
  .wizard-subtitle {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 480px;
  }
  
  .testimonial-card {
    max-width: 280px;
    margin-left: -140px;
  }
  
  .testimonial-text {
    font-size: 0.85rem;
  }
  
  .wizard-title {
    font-size: 1.8rem;
  }
  
  .wizard-title::before,
  .wizard-title::after {
    content: "⚡";
    font-size: 1rem;
    margin: 0 8px;
  }
  
  .wizard-subtitle {
    font-size: 1.2rem;
  }
  
  .testimonial-header {
    padding: 16px 16px 0;
  }
  
  .testimonial-body {
    padding: 16px;
  }
  
  .person-name {
    font-size: 1.1rem;
  }
  
  .avatar-container {
    width: 40px;
    height: 40px;
  }
  
  .quote-icon,
  .quote-icon-end {
    font-size: 18px;
  }
}

/* Fix for Safari and iOS WebKit */
@supports (-webkit-touch-callout: none) {
  .testimonial-card,
  .carousel-track {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }
}
</style> 