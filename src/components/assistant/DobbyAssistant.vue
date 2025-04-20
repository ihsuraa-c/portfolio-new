<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useHomeStore } from '@/stores/store-home';
import { useProjectStore } from '@/stores/store-projects';
import { useContactStore } from '@/stores/store-contact';
import { useUiStore } from "@/stores/store-ui";
import { useSocialStore } from "@/stores/store-social";

// Import the Dobby image from assets
import dobbyImage from '@/assets/dobby-real.jpg';

const route = useRoute();
const home = useHomeStore();
const project = useProjectStore();
const contact = useContactStore();
const ui = useUiStore();
const social = useSocialStore();

const isDialogVisible = ref(false);
const dialogMessage = ref('');
const previousRoute = ref('');
const isDragging = ref(false);
const dobbyRef = ref(null);
const userName = ref(localStorage.getItem('dobbyUserName') || '');
const isNameInputVisible = ref(false);
const showDialog = ref(false);
const showSocialMessage = ref(false);
const socialMessage = ref('');
const visitorCount = ref(0);

// Custom positioning variables
const positionX = ref('right');  // 'left' or 'right'
const positionY = ref('bottom'); // 'top' or 'bottom'
const dobbyPositionX = ref(20);  // pixels from edge
const dobbyPositionY = ref(20);  // pixels from edge

// Get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

// Get personalized greeting
const getPersonalizedGreeting = () => {
  const greeting = getGreeting();
  if (userName.value) {
    return `${greeting}, ${userName.value}!`;
  }
  return `${greeting}!`;
};

// Handle name input
const handleNameInput = (event) => {
  if (event.key === 'Enter') {
    userName.value = event.target.value;
    localStorage.setItem('dobbyUserName', userName.value);
    isNameInputVisible.value = false;
    setRouteMessage(route.path);
  }
};

// Set messages based on routes and interactions
const setRouteMessage = (path) => {
  if (path === '/' || path === '') {
    if (!userName.value) {
      dialogMessage.value = `${getGreeting()}! Dobby would be honored to know your name!`;
      isNameInputVisible.value = true;
    } else {
      dialogMessage.value = `${getPersonalizedGreeting()} Dobby is happy to welcome you to Mistress Aarushi's magical design portfolio!`;
    }
  } else if (path.includes('projects')) {
    dialogMessage.value = `${getPersonalizedGreeting()} Dobby presents Mistress Aarushi's enchanting design spells and works of magic!`;
  } else if (path.includes('contact')) {
    dialogMessage.value = `${getPersonalizedGreeting()} Dobby can help you send an owl to Mistress Aarushi. She is most responsive to magical correspondence!`;
  } else {
    dialogMessage.value = `${getPersonalizedGreeting()} Dobby wonders how you found this page. Perhaps a secret passage?`;
  }
};

// Handle button hover messages
const handleButtonHover = (buttonType) => {
  if (!isDragging.value) {
    switch (buttonType) {
      case 'theme':
        dialogMessage.value = `${getPersonalizedGreeting()} Dobby can help you switch between light and dark magic!`;
        break;
      case 'music':
        dialogMessage.value = `${getPersonalizedGreeting()} Dobby loves Hedwig's Theme! Would you like to hear it?`;
        break;
      case 'github':
        dialogMessage.value = `${getPersonalizedGreeting()} Dobby can show you Mistress Aarushi's magical code!`;
        break;
      case 'contact':
        dialogMessage.value = `${getPersonalizedGreeting()} Dobby can help you send an owl to Mistress Aarushi!`;
        break;
      default:
        break;
    }
    isDialogVisible.value = true;
  }
};

// Handle button leave
const handleButtonLeave = () => {
  if (!isDragging.value) {
    setRouteMessage(route.path);
  }
};

// Toggle dialog visibility when clicking on Dobby
const toggleDialog = () => {
  if (!isDragging.value) {
    if (!isDialogVisible.value) {
      setRouteMessage(route.path);
    }
    isDialogVisible.value = !isDialogVisible.value;
  }
};

// Mouse down handler to start drag
const onMouseDown = (e) => {
  const dobby = dobbyRef.value;
  if (!dobby) return;
  
  // Only handle left mouse button
  if (e.button !== 0) return;
  
  e.preventDefault();
  
  // Get starting positions
  const startX = e.clientX;
  const startY = e.clientY;
  
  // Get initial dobby position
  const rect = dobby.getBoundingClientRect();
  const initialLeft = rect.left;
  const initialTop = rect.top;
  
  // Check if we're actually dragging (move more than 5px)
  let hasDragged = false;
  
  // Mouse move handler during drag
  const onMouseMove = (e) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    // Check if we've moved enough to count as dragging
    if (!hasDragged && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      hasDragged = true;
      isDragging.value = true;
    }
    
    if (hasDragged) {
      // Calculate new position
      const newLeft = initialLeft + deltaX;
      const newTop = initialTop + deltaY;
      
      // Update dobby's position with boundary checks
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      
      // Direct manual positioning - this works reliably
      dobby.style.position = 'fixed';
      dobby.style.left = `${Math.max(0, Math.min(maxX, newLeft))}px`;
      dobby.style.top = `${Math.max(0, Math.min(maxY, newTop))}px`;
      dobby.style.right = 'auto';
      dobby.style.bottom = 'auto';
      dobby.style.margin = '0';
      
      // Check which side of the screen we're on for speech bubble
      const midX = window.innerWidth / 2;
      const midY = window.innerHeight / 2;
      
      if (newLeft < midX) {
        positionX.value = 'left';
      } else {
        positionX.value = 'right';
      }
      
      if (newTop < midY) {
        positionY.value = 'top';
      } else {
        positionY.value = 'bottom';
      }
      
      // Update stored position values for the dialog box
      dobbyPositionX.value = positionX.value === 'right' ? window.innerWidth - newLeft - rect.width : newLeft;
      dobbyPositionY.value = positionY.value === 'bottom' ? window.innerHeight - newTop - rect.height : newTop;
    }
  };
  
  // Mouse up handler to stop dragging
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    
    // If it was a click (not a drag), toggle dialog
    if (!hasDragged) {
      toggleDialog();
    } else {
      // It was a drag, so reset dragging state
      setTimeout(() => {
        isDragging.value = false;
      }, 0);
    }
  };
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// Create a timeout reference to manage the visibility timer
let dialogTimeout = null;

// Watch for route changes - this is the key part for fixing the issue
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    // Update message for the new route
    setRouteMessage(newPath);
    
    // Make the dialog visible
    isDialogVisible.value = true;
    
    // Clear any existing timeout
    if (dialogTimeout) {
      clearTimeout(dialogTimeout);
    }
    
    // Set a new timeout to hide the dialog after 5 seconds
    dialogTimeout = setTimeout(() => {
      isDialogVisible.value = false;
    }, 5000);
  }
});

const updateSocialPresence = () => {
  social.addVisitor();
  const visitors = social.getRecentVisitors();
  visitorCount.value = visitors.length;
  
  if (visitors.length > 1) {
    const otherVisitors = visitors.filter(v => v.id !== visitors[visitors.length - 1].id);
    const randomVisitor = otherVisitors[Math.floor(Math.random() * otherVisitors.length)];
    socialMessage.value = `✨ ${randomVisitor.name} is also exploring the portfolio! ✨`;
    showSocialMessage.value = true;
    
    // Hide the message after 5 seconds
    setTimeout(() => {
      showSocialMessage.value = false;
    }, 5000);
  }
};

// Update social presence every 30 seconds
let socialInterval;

onMounted(() => {
  // Default Dobby to bottom right
  if (dobbyRef.value) {
    dobbyRef.value.style.position = 'fixed';
    dobbyRef.value.style.right = '20px';
    dobbyRef.value.style.bottom = '20px';
    dobbyRef.value.style.left = 'auto';
    dobbyRef.value.style.top = 'auto';
  }
  
  // Initial message display
  setRouteMessage(route.path);
  isDialogVisible.value = true;
  
  // Hide after 5 seconds
  dialogTimeout = setTimeout(() => {
    isDialogVisible.value = false;
  }, 5000);

  // Add event listeners for button interactions
  const dobby = dobbyRef.value;
  if (dobby) {
    dobby.addEventListener('dobbyButtonHover', (event) => {
      handleButtonHover(event.detail.buttonType);
    });
    dobby.addEventListener('dobbyButtonLeave', handleButtonLeave);
  }

  updateSocialPresence();
  socialInterval = setInterval(() => {
    social.clearOldVisitors();
    updateSocialPresence();
  }, 30000);
});

// Cleanup event listeners
onBeforeUnmount(() => {
  const dobby = dobbyRef.value;
  if (dobby) {
    dobby.removeEventListener('dobbyButtonHover', handleButtonHover);
    dobby.removeEventListener('dobbyButtonLeave', handleButtonLeave);
  }

  if (socialInterval) {
    clearInterval(socialInterval);
  }
});
</script>

<template>
  <div>
    <!-- Dobby character -->
    <div 
      ref="dobbyRef"
      class="dobby-assistant" 
      :class="{ 'dragging': isDragging }"
      @mousedown="onMouseDown"
    >
      <img :src="dobbyImage" alt="Dobby" />
    </div>
    
    <!-- Dialog box -->
    <div 
      class="dobby-dialog" 
      :class="{
        'active': isDialogVisible,
        'dark-theme': ui.getTheme === 'dark',
        'light-theme': ui.getTheme === 'light',
        'left-side': positionX === 'left',
        'right-side': positionX === 'right',
        'top-side': positionY === 'top', 
        'bottom-side': positionY === 'bottom'
      }"
      :style="{
        right: positionX === 'right' ? `calc(${dobbyPositionX}px + 110px)` : 'auto',
        bottom: positionY === 'bottom' ? `calc(${dobbyPositionY}px + 5px)` : 'auto',
        left: positionX === 'left' ? `calc(${dobbyPositionX}px + 110px)` : 'auto',
        top: positionY === 'top' ? `calc(${dobbyPositionY}px + 5px)` : 'auto'
      }"
    >
      <p v-if="!isNameInputVisible">{{ dialogMessage }}</p>
      <input 
        v-else
        type="text" 
        class="name-input"
        placeholder="Enter your name..."
        @keyup="handleNameInput"
        :class="{
          'dark-theme': ui.getTheme === 'dark',
          'light-theme': ui.getTheme === 'light'
        }"
      />
    </div>

    <!-- Social Presence Message -->
    <v-snackbar
      v-model="showSocialMessage"
      :timeout="5000"
      location="top"
      color="primary"
      class="social-message"
    >
      <div class="d-flex align-center">
        <v-icon class="me-2">mdi-account-group</v-icon>
        <span class="text-h6">{{ socialMessage }}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<style scoped>
/* Dobby character styles */
.dobby-assistant {
  position: fixed;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: grab;
  z-index: 9996;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: transform 0.3s;
  animation: float 3s ease-in-out infinite;
  border: 3px solid #8d7144;
  user-select: none;
  touch-action: none;
  margin: 0;
}

.dobby-assistant.dragging {
  cursor: grabbing;
  animation: none;
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.dobby-assistant img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  pointer-events: none;
}

.dobby-assistant:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.5);
}

/* Dialog box styles */
.dobby-dialog {
  position: fixed;
  width: 250px;
  padding: 15px;
  border-radius: 15px;
  background-color: rgba(29, 29, 27, 0.95);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s, transform 0.5s;
  z-index: 9995;
  font-family: 'Potter', serif;
  border: 3px solid #8d7144;
  pointer-events: none;
}

.dobby-dialog p {
  margin: 0;
  color: #f1e6c4;
  font-size: 16px;
  letter-spacing: 0.5px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.dobby-dialog.active {
  opacity: 1;
  transform: translateY(0);
}

/* When Dobby is on the left side, dialog on right */
.dobby-dialog.left-side:before {
  content: '';
  position: absolute;
  left: -15px;
  top: 30px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 15px solid #8d7144;
}

/* When Dobby is on the right side, dialog on left */
.dobby-dialog.right-side:after {
  content: '';
  position: absolute;
  right: -15px;
  top: 30px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 15px solid #8d7144;
}

/* Theme colors */
.dobby-dialog.light-theme {
  background-color: rgba(240, 230, 210, 0.95);
  border-color: #a88c5a;
}

.dobby-dialog.light-theme p {
  color: #4b340f;
  text-shadow: none;
  font-weight: 500;
}

.dobby-dialog.light-theme.left-side:before {
  border-right-color: #a88c5a;
}

.dobby-dialog.light-theme.right-side:after {
  border-left-color: #a88c5a;
}

.dobby-dialog.dark-theme {
  background-color: rgba(29, 29, 27, 0.95);
  border-color: #513d1b;
}

.dobby-dialog.dark-theme.left-side:before {
  border-right-color: #513d1b;
}

.dobby-dialog.dark-theme.right-side:after {
  border-left-color: #513d1b;
}

.name-input {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid #8d7144;
  background-color: rgba(29, 29, 27, 0.95);
  color: #f1e6c4;
  font-family: 'Potter', serif;
  font-size: 16px;
  outline: none;
  pointer-events: auto;
}

.name-input.light-theme {
  background-color: rgba(240, 230, 210, 0.95);
  color: #4b340f;
  border-color: #a88c5a;
}

.name-input::placeholder {
  color: #8d7144;
  opacity: 0.7;
}

.name-input.light-theme::placeholder {
  color: #a88c5a;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .dobby-assistant {
    width: 80px;
    height: 80px;
  }
  
  .dobby-dialog {
    width: 200px;
    padding: 12px;
  }
  
  .dobby-dialog p {
    font-size: 14px;
  }
}

.dobby-assistant.light-theme {
  border-color: #a88c5a;
}

.social-message {
  font-family: 'Potter', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.social-message :deep(.v-snackbar__wrapper) {
  background-color: rgba(29, 29, 27, 0.95) !important;
  border: 2px solid #8d7144;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.social-message :deep(.v-snackbar__content) {
  padding: 16px 24px;
  font-size: 1.25rem;
  color: #f1e6c4;
  font-family: 'Potter', serif !important;
  letter-spacing: 0.5px;
}

.social-message :deep(.v-icon) {
  color: #8d7144;
  margin-right: 8px;
}

/* Light theme adjustments */
.social-message.light-theme :deep(.v-snackbar__wrapper) {
  background-color: rgba(240, 230, 210, 0.95) !important;
  border-color: #a88c5a;
}

.social-message.light-theme :deep(.v-snackbar__content) {
  color: #4b340f;
  font-family: 'Potter', serif !important;
  letter-spacing: 0.5px;
}

.social-message.light-theme :deep(.v-icon) {
  color: #a88c5a;
}
</style> 