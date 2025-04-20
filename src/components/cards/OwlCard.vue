<script setup>
import {ref} from "vue";

let snackbar = ref(false);
let form = ref({
  firstName: '',
  lastName: '',
  email: '',
  message: ''
});

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
});

const handleSubmit = () => {
  // Check if form has values
  if (!form.value.firstName || !form.value.email || !form.value.message) {
    snackbar.value = true;
    return;
  }
  
  // Create mailto link with form data
  const subject = `Message from ${form.value.firstName} ${form.value.lastName}`;
  const body = `Message: ${form.value.message}\n\nFrom: ${form.value.email}`;
  const mailtoLink = `mailto:${encodeURIComponent(props.contact.content.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open email client
  window.location.href = mailtoLink;
  
  // Reset form
  form.value.firstName = '';
  form.value.lastName = '';
  form.value.email = '';
  form.value.message = '';
};
</script>

<template>
  <v-card class="mt-lg-3 owl-card" variant="tonal">
    <v-card-title class="my-3 text-h5 text-sm-h5 text-md-h4 text-lg-h4 px-6">
      {{ contact.content.card_title }}
      <v-icon>mdi-owl</v-icon>
    </v-card-title>
    <v-card-text align="center" class="px-4 px-sm-6">
      <v-row>
        <v-col cols="12">
          <p class="text-body-1 mb-2">
            <a :href="`mailto:${contact.content.email}`" class="text-decoration-none">
              <strong class="email-address">{{ contact.content.email }}</strong>
            </a>
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
              v-model="form.firstName"
              variant="underlined"
              label="First Name"
              hide-details="auto"
              density="comfortable"
              required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
              v-model="form.lastName"
              variant="underlined"
              label="Last Name"
              hide-details="auto"
              density="comfortable"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
              v-model="form.email"
              variant="underlined"
              label="Email"
              hide-details="auto"
              density="comfortable"
              required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
              v-model="form.message"
              variant="underlined"
              label="Message"
              required
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-4 px-sm-6 pb-4">
      <v-btn class="nuxt-button-sub" @click="handleSubmit" block>Submit</v-btn>
    </v-card-actions>
  </v-card>
  <v-snackbar v-model="snackbar" timeout="3000" location="top">
    <div class="d-flex align-center">
      <v-icon class="me-2">mdi-book-cancel</v-icon>
      <span>Please fill in the required fields</span>
    </div>
  </v-snackbar>
</template>

<style scoped>
.owl-card {
  transition: box-shadow 0.3s ease;
}

@media (max-width: 600px) {
  .v-card-title {
    font-size: 1.5rem !important;
    padding: 16px !important;
  }
  
  .v-card-text, 
  .v-card-actions {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}

.email-address {
  word-break: break-word;
}
</style>

