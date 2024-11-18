<template>
  <div class="calendar-wrapper">
    <div class="calendar-body" :class="isTalking ? 'overlay' : ''">
      <button @click="resetCalendar">Reset Calendar</button>
      <div class="advent-card-grid">
        <AdventCard
            v-for="day in 24"
            :key="day"
            :day="day"
            :isOpened="day<=doorsOpened"
            :santaSpeaks="toggleTalking"
        />
      </div>
    </div>

    <div>
      <div v-if="isTalking" class="speech-bubble">
        <div v-html="text"></div>
        <button class="close-talk" @click="toggleTalking">OK</button>
      </div>
      <Vue3Lottie :animationData="santaJSON" class="figure" :class="isTalking ? 'highlight' : ''"/>
    </div>
    <Fireworks v-if="showFireworks" :options="fireworksOptions"
               :style="{top: 0, left: 50,
               width: '100%', height: '100%',
               position: 'fixed', zIndex: 800}"
    />
  </div>
</template>

<script setup>
import AdventCard from "@/components/AdventCard.vue";
import {LocalStorageService} from "@/service/storageservice.js";
import {Vue3Lottie} from "vue3-lottie";
import santaJSON from "@/assets/animations/santa.json";
import {ref} from "vue";
import {Fireworks} from "@fireworks-js/vue";

const santaText = {
  "1": "Hi there!<br/> I'm Jano, and I’m thrilled to be your personal English teacher for the next 24 days. Together, " +
      "we'll explore new vocabulary every day, helping you become more confident with the language. The calendar is divided into six exciting themes, " +
      "so you'll be learning English in a variety of contexts! I promise we'll have a great time—trust the process, and by Christmas, you'll be an English expert!<br/> " +
      "Ready to dive in?<br/> Well then, let's get this party started!",
  "5": "Hi there!<br/> How are you today? Do you feel like your English is improving? I’m confident it is!<br/> " +
      "Today, we’ll dive into our second chapter, <b>“On the Road.”</b> Over the next few days, you’ll learn new vocabulary " +
      "that will be helpful for traveling around the world.<br/> Are you ready?<br/> Let’s get started!",
  "9": "Hi there!<br/> New day, new chapter! Are you ready to explore the English language further?<br/> " +
      "This time, we’ll focus on more specific vocabulary. We’ll learn new words and phrases that may be useful" +
      " when visiting a hospital.<br/> Let’s see how many of these you’re already familiar with!<br/> Let’s get started!",
  "13": "Hi there!<br/> Now that you’ve learned useful vocabulary and phrases for the hospital, we’ll move on to another exciting topic:<br/> " +
      "the Hair Salon!<br/> Who doesn’t enjoy treating themselves to a beautiful haircut from time to time?<br/> In the coming days, " +
      "you’ll learn how to express yourself at the salon, ensuring you get exactly what you want!<br/> Let’s get started!",
  "17": "As Christmas approaches, your English skills are improving every day! This new chapter may seem a bit challenging at first, " +
      "but it will be fun to learn and useful for showing off your English skills. Over the next few days, we will focus on idioms—phrases " +
      "that have meanings different from the individual words. For example, \"kick the bucket\" means to die, not to literally kick a bucket.<br/> " +
      "You’ll understand what I mean soon! The idioms we’ll explore are very common and will help you speak English more naturally.<br/>" +
      "One last thing, in this chapter, you’ll complete two vocabulary sessions paired with their corresponding translation sessions, " +
      "rather than the usual vocabulary-sentence completion-translation-listening format. This approach is more effective here, " +
      "as it’s crucial for you to understand and remember the meanings of the idioms to use them correctly.<br/>Are you ready to sound like a pro?<br/>",
  "21": "Hello again! Welcome to the final chapter of your personalized advent calendar! How are you feeling today? " +
      "Are the Christmas preparations already causing you stress? Don't worry—I got you! This last chapter will be quick and easy. " +
      "We’ll explore useful words and phrases related to holidays throughout the year. What are some specific Italian holidays? " +
      "Which days hold significance during Easter? And, of course, we’ll cover all the essential vocabulary for Christmas! " +
      "Are you ready for one last ride?",
  "24": "Congratulations! You did it! You've successfully completed your advent calendar and can now consider yourself a true English pro! " +
      "I’m confident that you can engage in conversations with ease and feel more confident speaking English. While there’s still much to learn, " +
      "remember that progress comes step by step! We’re proud of you and all that you’ve accomplished! Merry Christmas!"
}

const localStorageService = new LocalStorageService();
const isTalking = ref(false);
const showFireworks = ref(false);

const doorsOpened = localStorageService.getData("doorsOpened") || 0;

const text = ref('');

const fireworksOptions = ref({
  speed: 3,
  acceleration: 1.05,
  friction: 0.98,
  gravity: 1.5,
  particles: 50,
  trace: 3,
  traceSpeed: 8,
  flicker: 50,
  intensity: 30,
  explosion: 10,
  hue: { min: 0, max: 360 }, // Add colors to the options
});

const resetCalendar = () => {
  localStorageService.clearLocalStorage();
  doorsOpened.value = 0;
};

const firework = () => {
  showFireworks.value = true;
};

const toggleTalking = async (santaDay) => {
  let dayCheck = localStorageService.getData("santaDays");
  try {
    dayCheck = JSON.parse(dayCheck); // Parse JSON if stored data is in JSON format
  } catch (e) {
    dayCheck = dayCheck || 0;
  }

  if (santaDay === 24) {
    firework();
  }

  if(!isTalking.value && dayCheck < santaDay && santaText.hasOwnProperty(santaDay)){
    text.value = santaText[santaDay];
    isTalking.value = true;
    console.log("Santa is talking");
  } else {
    isTalking.value = false;
    text.value = '';
    localStorageService.storeData("santaDays", santaDay);
  }
  return isTalking.value;
};
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

.calendar-body {
  flex-grow: 1; /* Ensures the body takes the remaining available space */
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
  align-self: center;
  z-index: 2;
}

.calendar-body.overlay {
  pointer-events: none;
  opacity: 0.5;
}

.figure {
  position: absolute;
  top: 78%;
  z-index: 1000;
  height: 20%;
  width: 15%;
  right: 0;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.5, 1), /* Smooth bounce effect */
              box-shadow 0.3s ease-out,
              opacity 0.4s ease-in-out;

}

.figure.highlight {
  transform: scale(1.5) translateX(-50%) translateY(-10%);
}

.speech-bubble {
  position: absolute;
  bottom: 32%;
  left: 70%;
  transform: translateX(-70%);
  z-index: 1000;
  background-color: #ece5ce;
  border-radius: 11px;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 15px;
  color: #774f38;
  animation: float 5s ease-in-out infinite;
}

.speech-bubble:after {
  content: ".";
  font-weight: bold;
  -webkit-text-fill-color: #ece5ce;
  text-align: right;
  font-size: 55px;
  width: 55px;
  height: 11px;
  line-height: 30px;
  border-radius: 11px;
  background-color: #ece5ce;
  position: absolute;
  display: block;
  bottom: -30px;
  right: 0;
  z-index: -2;
  animation: float2 5s ease-in-out infinite;
}

.close-talk {
  background-color: #774f38;
  color: #ece5ce;
  border: none;
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
</style>
