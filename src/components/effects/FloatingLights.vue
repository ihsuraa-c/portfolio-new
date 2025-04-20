<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useUiStore } from '@/stores/store-ui';

const props = defineProps({
  count: {
    type: Number,
    default: 15
  },
  attractionForce: {
    type: Number,
    default: 0.15
  },
  responsive: {
    type: Boolean,
    default: true
  }
});

const ui = useUiStore();
const container = ref(null);
const lights = ref([]);
const mousePosition = ref({ x: -1000, y: -1000 });
const mousePresent = ref(false);
const attractionRadius = 300; // How far the cursor attracts lights
const hoverRadius = 50; // How close the cursor has to be to hover a light

// Theme-based colors
const lightColors = computed(() => {
  const isDark = ui.getTheme === 'dark';
  return isDark ? 
    [
      'rgba(255, 255, 255, 0.7)',
      'rgba(41, 182, 246, 0.7)',
      'rgba(66, 165, 245, 0.7)',
      'rgba(126, 87, 194, 0.7)',
      'rgba(94, 53, 177, 0.7)'
    ] : 
    [
      'rgba(255, 235, 59, 0.7)',
      'rgba(255, 193, 7, 0.7)',
      'rgba(255, 152, 0, 0.7)',
      'rgba(255, 87, 34, 0.7)',
      'rgba(244, 67, 54, 0.7)'
    ];
});

// Determine number of lights based on screen size
function getResponsiveCount() {
  if (!props.responsive) return props.count;
  
  const width = window.innerWidth;
  
  if (width < 600) {
    // Mobile - fewer lights for better performance
    return Math.floor(props.count * 0.5);
  } else if (width < 960) {
    // Tablet
    return Math.floor(props.count * 0.7);
  } else if (width < 1264) {
    // Desktop
    return props.count;
  } else {
    // Large desktop - more lights for a richer experience
    return Math.floor(props.count * 1.2);
  }
}

// Initialize lights
function initLights() {
  if (!container.value) return;
  
  const rect = container.value.getBoundingClientRect();
  const lightCount = getResponsiveCount();
  
  // Create lights
  for (let i = 0; i < lightCount; i++) {
    lights.value.push({
      id: i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 10 + 5,
      baseSize: Math.random() * 10 + 5, // Store the base size
      opacity: Math.random() * 0.5 + 0.3,
      baseOpacity: Math.random() * 0.5 + 0.3, // Store the base opacity
      color: lightColors.value[Math.floor(Math.random() * lightColors.value.length)],
      vx: Math.random() * 0.6 - 0.3,
      vy: Math.random() * 0.6 - 0.3,
      baseSpeed: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 3 + 2,
      hovered: false
    });
  }
  
  // Start animation
  animateLights();
}

// Animate the lights
let animationFrame;
function animateLights() {
  if (!container.value) {
    animationFrame = requestAnimationFrame(animateLights);
    return;
  }
  
  const rect = container.value.getBoundingClientRect();
  
  // Update each light
  lights.value.forEach(light => {
    // Reset hover state
    light.hovered = false;
    
    // Apply attraction to cursor if mouse is in parallax area
    if (mousePresent.value) {
      // Convert global mouse position to container-relative position
      const relativeX = mousePosition.value.x - rect.left;
      const relativeY = mousePosition.value.y - rect.top;
      
      // Calculate distance to cursor
      const dx = relativeX - light.x;
      const dy = relativeY - light.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Check if cursor is hovering over this light
      if (distance < hoverRadius) {
        light.hovered = true;
        light.size = light.baseSize * 2; // Make the light bigger
        light.opacity = 0.9; // Make it more opaque
      } else {
        light.size = light.baseSize;
        light.opacity = light.baseOpacity;
      }
      
      // Apply attraction if within radius
      if (distance < attractionRadius) {
        const force = (1 - distance / attractionRadius) * props.attractionForce;
        light.vx += dx * force / Math.max(distance, 0.1);
        light.vy += dy * force / Math.max(distance, 0.1);
      }
    }
    
    // Apply some natural movement
    light.vx += (Math.random() - 0.5) * 0.05;
    light.vy += (Math.random() - 0.5) * 0.05;
    
    // Limit velocity
    const speed = Math.sqrt(light.vx * light.vx + light.vy * light.vy);
    if (speed > light.baseSpeed) {
      light.vx = (light.vx / speed) * light.baseSpeed;
      light.vy = (light.vy / speed) * light.baseSpeed;
    }
    
    // Update position
    light.x += light.vx;
    light.y += light.vy;
    
    // Boundary checking with bounce
    if (light.x < 0) {
      light.x = 0;
      light.vx *= -0.5;
    } else if (light.x > rect.width) {
      light.x = rect.width;
      light.vx *= -0.5;
    }
    
    if (light.y < 0) {
      light.y = 0;
      light.vy *= -0.5;
    } else if (light.y > rect.height) {
      light.y = rect.height;
      light.vy *= -0.5;
    }
  });
  
  animationFrame = requestAnimationFrame(animateLights);
}

// Track mouse position
function handleMouseMove(e) {
  const rect = container.value.getBoundingClientRect();
  
  // Check if mouse is inside the container
  if (
    e.clientX >= rect.left && 
    e.clientX <= rect.right && 
    e.clientY >= rect.top && 
    e.clientY <= rect.bottom
  ) {
    mousePresent.value = true;
    mousePosition.value = { x: e.clientX, y: e.clientY };
  } else {
    mousePresent.value = false;
  }
}

// Create a special light burst effect when clicking
function handleClick(e) {
  if (!mousePresent.value) return;
  
  const rect = container.value.getBoundingClientRect();
  
  // Create a burst of new lights from the click position
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 30 + 10;
    
    const relativeX = mousePosition.value.x - rect.left;
    const relativeY = mousePosition.value.y - rect.top;
    
    lights.value.push({
      id: Date.now() + i,
      x: relativeX + Math.cos(angle) * distance,
      y: relativeY + Math.sin(angle) * distance,
      size: Math.random() * 12 + 8,
      baseSize: Math.random() * 12 + 8,
      opacity: 0.8,
      baseOpacity: 0.8,
      color: lightColors.value[Math.floor(Math.random() * lightColors.value.length)],
      vx: Math.cos(angle) * (Math.random() * 2 + 1),
      vy: Math.sin(angle) * (Math.random() * 2 + 1),
      baseSpeed: Math.random() * 1 + 0.5,
      pulseSpeed: Math.random() * 2 + 1,
      hovered: false,
      temporary: true,
      lifetime: 50 + Math.floor(Math.random() * 50)
    });
  }
  
  // Make sure we don't have too many lights (for performance)
  const permanentLights = lights.value.filter(light => !light.temporary);
  const temporaryLights = lights.value.filter(light => light.temporary);
  
  // Sort temporary lights by remaining lifetime and keep the newest ones
  temporaryLights.sort((a, b) => {
    if (!a.lifetime) return 1;
    if (!b.lifetime) return -1;
    return b.lifetime - a.lifetime;
  });
  
  // Keep only the newest temporary lights
  const maxTemporaryLights = 40;
  const trimmedTemporaryLights = temporaryLights.slice(0, maxTemporaryLights);
  
  // Combine permanent and temporary lights
  lights.value = [...permanentLights, ...trimmedTemporaryLights];
}

// Enhanced resize handler
function handleResize() {
  if (!container.value) return;
  
  const rect = container.value.getBoundingClientRect();
  const lightCount = getResponsiveCount();
  
  // Reset lights that are outside the container
  lights.value.forEach(light => {
    if (light.x > rect.width) light.x = rect.width * Math.random();
    if (light.y > rect.height) light.y = rect.height * Math.random();
  });
  
  // Adjust the number of lights if responsive
  if (props.responsive) {
    const permanentLights = lights.value.filter(light => !light.temporary);
    
    // If we need more lights
    if (permanentLights.length < lightCount) {
      const additionalLights = lightCount - permanentLights.length;
      
      for (let i = 0; i < additionalLights; i++) {
        lights.value.push({
          id: `responsive-${Date.now()}-${i}`,
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          size: Math.random() * 10 + 5,
          baseSize: Math.random() * 10 + 5,
          opacity: Math.random() * 0.5 + 0.3,
          baseOpacity: Math.random() * 0.5 + 0.3,
          color: lightColors.value[Math.floor(Math.random() * lightColors.value.length)],
          vx: Math.random() * 0.6 - 0.3,
          vy: Math.random() * 0.6 - 0.3,
          baseSpeed: Math.random() * 0.5 + 0.2,
          pulseSpeed: Math.random() * 3 + 2,
          hovered: false
        });
      }
    } 
    // If we need fewer lights
    else if (permanentLights.length > lightCount) {
      // Only keep the first 'lightCount' permanent lights
      const temporaryLights = lights.value.filter(light => light.temporary);
      lights.value = [...permanentLights.slice(0, lightCount), ...temporaryLights];
    }
  }
}

// Process temporary lights (reduce lifetime and remove dead ones)
function processTemporaryLights() {
  lights.value.forEach((light, index) => {
    if (light.temporary) {
      if (!light.lifetime) light.lifetime = 100; // Default lifetime
      
      light.lifetime--;
      if (light.lifetime <= 0) {
        lights.value.splice(index, 1);
      } else {
        // Fade out as lifetime decreases
        light.opacity = light.baseOpacity * (light.lifetime / 100);
      }
    }
  });
  
  setTimeout(processTemporaryLights, 100);
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('click', handleClick);
  window.addEventListener('resize', handleResize);
  
  // Short delay to ensure container is mounted
  setTimeout(() => {
    initLights();
    processTemporaryLights();
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('click', handleClick);
  window.removeEventListener('resize', handleResize);
  
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<template>
  <div ref="container" class="floating-lights-container">
    <div 
      v-for="light in lights" 
      :key="light.id" 
      class="floating-light"
      :class="{ 'hovered': light.hovered }"
      :style="{
        left: `${light.x}px`,
        top: `${light.y}px`,
        width: `${light.size}px`,
        height: `${light.size}px`,
        opacity: light.opacity,
        backgroundColor: light.color,
        animationDuration: `${light.pulseSpeed}s`
      }"
    ></div>
    <slot></slot>
  </div>
</template>

<style scoped>
.floating-lights-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.floating-light {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  animation: pulse-light infinite ease-in-out;
  mix-blend-mode: screen;
  z-index: 5;
  transition: width 0.3s, height 0.3s, opacity 0.3s, box-shadow 0.3s;
}

.floating-light.hovered {
  animation: pulse-light-hover infinite ease-in-out 1s;
  box-shadow: 0 0 25px 15px rgba(255, 255, 255, 0.5);
}

@keyframes pulse-light {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
}

@keyframes pulse-light-hover {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style> 