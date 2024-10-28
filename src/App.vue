<template>
  <div class="app-container">
    <CalenderComponent />

    <Vue3Lottie :animationData="snowJSON" class="snow" style="left: -5%"/>
    <Vue3Lottie :animationData="snowJSON" class="snow" style="left: 75%"/>
  </div>
</template>

<script setup>
import CalenderComponent from "./components/CalenderComponent.vue";
import { Vue3Lottie } from 'vue3-lottie'
import {LocalStorageService} from "@/service/storageservice.js";

import snowJSON from '@/assets/animations/snow.json';
import {onMounted} from "vue";

const localStorageService = new LocalStorageService();

onMounted(() => {
  localStorageService.initializeLocalStorage();
  console.log('Local storage initialized');
});
</script>

<style scoped>
.app-container {
  position: relative;
  overflow: hidden; /* This will prevent any overflow from snow animations */
  height: 100vh; /* Full viewport height */
  width: 100%;    /* Full width of the app */
}

.snow {
  position: absolute;
  top: 0;
  z-index: 1;
  height: 100%;
  width: 33%;
}
</style>
