<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useUiStore } from '@/stores/store-ui';

const ui = useUiStore();
const cursorPosition = ref({ x: -100, y: -100 });
const particles = ref([]);
const maxParticles = 20;
// Larger cursor size in light theme
const cursorBaseSize = computed(() => {
  return ui.getTheme === 'dark' ? 24 : 30; // 25% larger in light theme
});
const cursorSize = ref(cursorBaseSize.value);

// Update cursor size when theme changes
watch(() => cursorBaseSize.value, (newSize) => {
  cursorSize.value = newSize;
});

// Base cursor colors computed from theme - BLACK for light theme
const baseCursorColor = computed(() => {
  return ui.getTheme === 'dark' ? '255, 255, 255' : '0, 0, 0'; // Solid black for light theme
});
// Active cursor color that can be changed temporarily
const cursorColor = ref(baseCursorColor.value);
// Compute glow color based on theme - DARK RED for light theme
const glowColor = computed(() => {
  return ui.getTheme === 'dark' 
    ? '255, 255, 255' 
    : '180, 0, 0'; // Deep red for light theme
});
const clickColor = computed(() => {
  return ui.getTheme === 'dark' ? '255, 255, 150' : '255, 0, 0'; // Bright red for light theme
});
const wandSize = 32;
const wandImage = ref(null);
const wandImageLoaded = ref(false);
const explosionParticles = ref([]);

// Load wand image
onMounted(() => {
  updateWandImage();
});

// Update wand image based on theme
function updateWandImage() {
  const isDark = ui.getTheme === 'dark';
  const imageSrc = isDark ? '/images/wand-cursor.svg' : '/images/wand-cursor-light.svg';
  
  wandImageLoaded.value = false; // Reset loaded state
  wandImage.value = new Image();
  wandImage.value.src = imageSrc;
  wandImage.value.onload = () => {
    wandImageLoaded.value = true;
  };
}

// Get cursor opacity based on theme - FULL OPACITY for light theme
const cursorOpacity = computed(() => {
  return ui.getTheme === 'dark' ? 0.7 : 1.0; // Full opacity in light theme
});

// Get cursor shadow based on theme - STRONG BLACK SHADOW for light theme
const cursorShadow = computed(() => {
  if (ui.getTheme === 'dark') {
    return `0 0 20px 8px rgba(${glowColor.value}, 0.5), 0 0 40px 15px rgba(${glowColor.value}, 0.3)`;
  } else {
    // Very dark, thick shadow for light theme
    return `0 0 10px 5px rgba(${glowColor.value}, 0.9), 0 0 20px 10px rgba(${glowColor.value}, 0.7), 0 0 3px 2px rgba(0, 0, 0, 0.9)`;
  }
});

// Get cursor border based on theme - THICK BLACK BORDER for light theme
const cursorBorder = computed(() => {
  return ui.getTheme === 'dark' ? 'none' : '2px solid rgba(0, 0, 0, 0.9)';
});

// Get theme-based colors for particles - DARK VIBRANT COLORS for light theme
const particleColors = computed(() => {
  const isDark = ui.getTheme === 'dark';
  return isDark ? 
    [
      '255, 255, 255',
      '41, 182, 246',
      '66, 165, 245',
      '126, 87, 194',
      '94, 53, 177'
    ] : 
    [
      '0, 0, 0',       // Black
      '180, 0, 0',     // Dark red
      '139, 0, 139',   // Dark magenta
      '0, 0, 128',     // Navy
      '128, 0, 0'      // Maroon
    ];
});

// Function to determine if we should add particle borders in light theme
const getParticleBorder = computed(() => {
  return ui.getTheme === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.8)';
});

// Particle opacity based on theme
const baseParticleOpacity = computed(() => {
  return ui.getTheme === 'dark' ? 0.6 : 0.9; // Higher opacity in light theme
});

// Create particle objects with theme-specific styling
const createParticles = () => {
  for (let i = 0; i < maxParticles; i++) {
    particles.value.push({
      id: i,
      x: -100,
      y: -100,
      size: Math.random() * 6 + 3,
      delay: i * 40,
      opacity: Math.random() * 0.3 + baseParticleOpacity.value,
      animationDuration: Math.random() * 3 + 2,
      color: getRandomColor(),
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.2
    });
  }
};

// Get a random magical color
const getRandomColor = () => {
  const colors = particleColors.value;
  return colors[Math.floor(Math.random() * colors.length)];
};

// Track mouse position and update cursor
const handleMouseMove = (event) => {
  cursorPosition.value = {
    x: event.clientX,
    y: event.clientY
  };
  
  // Apply size pulsing effect based on theme
  const pulseAmount = ui.getTheme === 'dark' ? 3 : 4; // Larger pulse in light theme
  cursorSize.value = cursorBaseSize.value + (Math.sin(Date.now() / 300) * pulseAmount);
  
  setTimeout(() => {
    updateParticles();
  }, 10);
};

// Update particle positions with some randomness
const updateParticles = () => {
  particles.value.forEach((particle, index) => {
    setTimeout(() => {
      // Update particle angle slightly for a more magical movement
      particle.angle += (Math.random() - 0.5) * 0.3;
      
      // Calculate new position based on angle and distance from cursor
      const distance = 30 + Math.sin(Date.now() / 1000 + index) * 15;
      particle.x = cursorPosition.value.x + Math.cos(particle.angle) * distance;
      particle.y = cursorPosition.value.y + Math.sin(particle.angle) * distance;
      
      // Occasionally change color for sparkly effect
      if (Math.random() < 0.05) {
        particle.color = getRandomColor();
      }
    }, particle.delay);
  });
};

// Enhanced click effect with magical explosion
const handleClick = () => {
  // Brighter cursor during click
  cursorColor.value = clickColor.value;
  setTimeout(() => {
    cursorColor.value = baseCursorColor.value;
  }, 300);
  
  // Create explosion effect for existing particles
  particles.value.forEach(particle => {
    particle.speed = Math.random() * 2 + 1;
    setTimeout(() => {
      particle.speed = Math.random() * 0.5 + 0.2;
    }, 500);
  });
  
  // Create explosion particles
  createExplosionEffect();
};

// Create explosion effect with particles that fly outward
const createExplosionEffect = () => {
  // Clear old explosion particles
  explosionParticles.value = [];
  
  // Create new explosion particles
  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * Math.PI * 2;
    const speed = Math.random() * 3 + 2;
    const size = Math.random() * 8 + 3;
    const lifetime = 40 + Math.random() * 20;
    const color = getRandomColor();
    
    explosionParticles.value.push({
      id: `explosion-${i}`,
      x: cursorPosition.value.x,
      y: cursorPosition.value.y,
      angle,
      speed,
      size,
      lifetime,
      initialLifetime: lifetime,
      color
    });
  }
  
  // Animate explosion particles
  animateExplosion();
};

// Animate explosion particles
const animateExplosion = () => {
  if (explosionParticles.value.length === 0) return;
  
  // Update positions
  explosionParticles.value.forEach((particle, index) => {
    particle.lifetime--;
    particle.x += Math.cos(particle.angle) * particle.speed;
    particle.y += Math.sin(particle.angle) * particle.speed;
    particle.size = (particle.lifetime / particle.initialLifetime) * particle.size;
    
    // Remove dead particles
    if (particle.lifetime <= 0) {
      explosionParticles.value.splice(index, 1);
    }
  });
  
  // Continue animation if particles remain
  if (explosionParticles.value.length > 0) {
    requestAnimationFrame(animateExplosion);
  }
};

// Draw wand cursor onto canvas
const canvasRef = ref(null);
let animationFrame = null;

const renderCanvas = () => {
  if (!canvasRef.value || !wandImageLoaded.value) {
    animationFrame = requestAnimationFrame(renderCanvas);
    return;
  }
  
  const ctx = canvasRef.value.getContext('2d');
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  
  // Draw wand image with size based on theme
  const isDark = ui.getTheme === 'dark';
  const effectiveWandSize = isDark ? wandSize : wandSize * 1.2; // 20% larger in light theme
  
  ctx.drawImage(
    wandImage.value,
    cursorPosition.value.x - effectiveWandSize / 2,
    cursorPosition.value.y - effectiveWandSize / 2,
    effectiveWandSize,
    effectiveWandSize
  );
  
  animationFrame = requestAnimationFrame(renderCanvas);
};

const setupCanvas = () => {
  if (!canvasRef.value) return;
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
  
  // Start rendering
  renderCanvas();
};

const handleResize = () => {
  if (!canvasRef.value) return;
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
};

// Watch for theme changes
watch(() => ui.getTheme, () => {
  // Update colors of existing particles
  particles.value.forEach(particle => {
    particle.color = getRandomColor();
  });
  
  // Update cursor color to match new theme
  cursorColor.value = baseCursorColor.value;
  
  // Update wand image based on theme
  updateWandImage();
});

onMounted(() => {
  createParticles();
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('click', handleClick);
  window.addEventListener('resize', handleResize);
  setupCanvas();
  
  // Hide default cursor
  document.body.style.cursor = 'none';
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('click', handleClick);
  window.removeEventListener('resize', handleResize);
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  
  // Restore default cursor
  document.body.style.cursor = 'auto';
});
</script>

<template>
  <canvas ref="canvasRef" class="cursor-canvas"></canvas>
  
  <div 
    class="cursor-light" 
    :style="{
      left: `${cursorPosition.x}px`,
      top: `${cursorPosition.y}px`,
      width: `${cursorSize}px`,
      height: `${cursorSize}px`,
      background: `rgba(${cursorColor}, ${cursorOpacity})`,
      boxShadow: cursorShadow,
      border: cursorBorder
    }"
  ></div>
  
  <div 
    v-for="particle in particles" 
    :key="particle.id"
    class="light-particle"
    :style="{
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      opacity: particle.opacity,
      background: `rgba(${particle.color}, ${particle.opacity})`,
      boxShadow: `0 0 10px 2px rgba(${particle.color}, ${particle.opacity})`,
      border: getParticleBorder,
      animationName: 'pulse',
      animationDuration: `${particle.animationDuration}s`,
      animationIterationCount: 'infinite'
    }"
  ></div>
  
  <!-- Explosion particles with borders in light theme -->
  <div 
    v-for="particle in explosionParticles" 
    :key="particle.id"
    class="explosion-particle"
    :style="{
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: `rgba(${particle.color}, ${particle.lifetime / particle.initialLifetime})`,
      boxShadow: `0 0 10px 2px rgba(${particle.color}, ${particle.lifetime / particle.initialLifetime})`,
      border: getParticleBorder
    }"
  ></div>
</template>

<style scoped>
.cursor-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.cursor-light {
  position: fixed;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: width 0.3s, height 0.3s;
  z-index: 9998;
}

.light-particle {
  position: fixed;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9997;
}

.explosion-particle {
  position: fixed;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9996;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style> 