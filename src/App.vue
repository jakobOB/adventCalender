<template>
  <div class="app-container">
    <CalenderComponent />

    <Vue3Lottie :animationData="snowflakeJSON" class="snow" style="left: -5%"/>
    <Vue3Lottie :animationData="snowflakeJSON" class="snow" style="left: 25%"/>
    <Vue3Lottie :animationData="snowflakeJSON" class="snow" style="left: 50%"/>
    <Vue3Lottie :animationData="snowflakeJSON" class="snow" style="left: 75%"/>
  </div>
</template>

<script setup>
import CalenderComponent from "./components/CalenderComponent.vue";
import { Vue3Lottie } from 'vue3-lottie'
import {LocalStorageService} from "@/service/storageservice.js";

import snowflakeJSON from '@/assets/animations/snow2.json';
import {onMounted} from "vue";

const localStorageService = new LocalStorageService();

onMounted(() => {
  localStorageService.initializeLocalStorage();
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
  top: -5%;
  z-index: 1;
  height: 50%;
  width: 33%;
}
</style>
