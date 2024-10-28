<template>
  <div class="calendar-wrapper">
    <div class="calendar-header">
      <h1>Advent Calendar</h1>
    </div>
    <div class="calendar-body">
      <div class="advent-card-grid">
        <AdventCard v-for="day in 24" :key="day" :day="day" :isOpened="day<=doorsOpened"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdventCard from "@/components/AdventCard.vue";
import {LocalStorageService} from "@/service/storageservice.js";

const localStorageService = new LocalStorageService();

const doorsOpened = localStorageService.getData("doorsOpened") || [];
</script>

<style scoped>
.advent-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Auto-fit for responsive design */
  grid-template-rows: repeat(auto-fill, 1fr); /* Ensure rows fill available space */
  gap: 10px;
  padding: 10px;
  height: 100%; /* Take full available height */
}

.calendar-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh; /* Make the calendar take the full viewport height */
  padding: 20px;
  box-sizing: border-box;
}

.calendar-header {
  transform-style: preserve-3d;
  transition: transform 0.8s, box-shadow 0.3s;
  box-shadow: 0 15px 20px rgba(0, 0, 0, 0.5); /* Add shadow */
  background: orange;
  text-align: center;
  font-size: 2rem;
  width: 70%;
  align-self: center;
  padding: 10px;
  border-radius: 10px;
  z-index: 2;

  h1 {
    margin: 0;
  }
}

.calendar-body {
  flex-grow: 1; /* Ensures the body takes the remaining available space */
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
  align-self: center;
  z-index: 2;
}
</style>
