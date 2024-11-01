<template>
  <div class="advent-card-container">
    <!-- Front side of the card -->
    <div class="advent-card" @click="openDialog" :class="{ 'opened': doorOpen }" >
      <div class="card-front">
        <img :src="`./doors/${day}.png`" alt="Card Front" class="card-image" />

        <div v-if="doorOpen" class="opened-overlay">
          <span>Opened</span>
        </div>
      </div>
    </div>

    <VocabularyDialog
        :visible="isVocabularyDay"
        :vocabulary="vocabularyList"
        :topic="selectedTopic"
        @closeDialog="closeDialog"
        @dayCompleted="dayCompleted"
    />
    <SentenceDialog
        :visible="isSentenceDay"
        :sentences="sentenceList"
        :words="sentenceWordList"
        :topic="selectedTopic"
        @closeDialog="closeDialog"
        @dayCompleted="dayCompleted"
    />
    <ListeningDialog
        :visible="isListeningDay"
        :topic="selectedTopic"
        :listening="listeningList"
        @closeDialog="closeDialog"
    />
    <TranslationDialog
        :visible="isTranslationDay"
        :topic="selectedTopic"
        :translations="translationSentences"
        @closeDialog="closeDialog"
        @dayCompleted="dayCompleted"
    />
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import VocabularyDialog from "@/components/VocabularyDialog.vue";
import SentenceDialog from "@/components/SentenceDialog.vue";
import ListeningDialog from "@/components/ListeningDialog.vue";
import TranslationDialog from "@/components/TranslationDialog.vue";

import { LocalStorageService } from "@/service/storageservice.js";

const props = defineProps({
  day: Number,
  isOpened: Boolean
});

const localStorageService = new LocalStorageService();

const doorOpen = ref(props.isOpened);

// Reactive state for the dialog visibility
const isVocabularyDay = ref(false);
const isSentenceDay = ref(false);
const isListeningDay = ref(false);
const isTranslationDay = ref(false);

const selectedTopic = ref('');
// Vocabulary data
const vocabularyList = ref([]);
// Sentence data
const allSentenceData = ref([]);
const sentenceList = ref([]);
const sentenceWordList = ref([]);
// Translation Data
const allTranslationData = ref([]);
const translationSentences = ref([]);
// Listening data
const listeningList = ref([]);

const openDialog = () => {
  // check if current date is < props.day,  only get the day if it is less than or equal to the current date
  let doorsOpened = localStorageService.getData('doorsOpened');
  if (props.day > new Date().getDate() || props.day-1 !== doorsOpened) {
    return;
  }

  const exercise = getExercise(props.day);

  if (exercise === 'Vocabulary') {
    isVocabularyDay.value = true;
    selectedTopic.value = getTopic(props.day);
    vocabularyList.value = localStorageService.getData(exercise)[selectedTopic.value];
  }
  else if (exercise === 'Sentence Completion') {
    isSentenceDay.value = true;
    selectedTopic.value = getTopic(props.day);
    allSentenceData.value = localStorageService.getData(exercise);
    sentenceList.value = allSentenceData.value[selectedTopic.value];
    sentenceWordList.value = [];
    sentenceList.value.forEach(sentence => {
      sentenceWordList.value.push(sentence.solution);
    });
  }
  else if (exercise === 'Listening') {
    isListeningDay.value = true;
    selectedTopic.value = getTopic(props.day);
    listeningList.value = localStorageService.getData(exercise)[selectedTopic.value];
  }
  else if (exercise === 'Translation') {
    isTranslationDay.value = true;
    selectedTopic.value = getTopic(props.day);
    allTranslationData.value = localStorageService.getData(exercise);
    translationSentences.value = allTranslationData.value[selectedTopic.value];
  }
};

const closeDialog = () => {
  isVocabularyDay.value = false;
  isSentenceDay.value = false;
  isListeningDay.value = false;
  isTranslationDay.value = false;
};

const getExercise = (day) => {
  const exercises = ["Vocabulary", "Sentence Completion", "Translation", "Listening"];
  return exercises[(day - 1) % 4];
};

const getTopic = (day) => {
  if (day >= 1 && day <= 4) return 'Everyday English';
  if (day >= 5 && day <= 8) return 'On the Road';
  if (day >= 9 && day <= 12) return 'In the Hospital';
  if (day >= 13 && day <= 16) return 'At the Hair saloon';
  if (day >= 17 && day <= 20) return 'Idioms';
  if (day >= 21 && day <= 24) return 'Holidays';
};

const dayCompleted = () => {
  doorOpen.value = true;
  localStorageService.storeData('doorsOpened', props.day);
};

// Watch for changes in the sentence list and store the data in local storage
watch(sentenceList, (newVal) => {
  allSentenceData.value[selectedTopic.value] = newVal;
  localStorageService.storeData('Sentence Completion', allSentenceData.value);
}, { deep: true });

// // Watch for changes in the translation list and store the data in local storage
watch(translationSentences, (newVal) => {
  allTranslationData.value[selectedTopic.value] = newVal;
  localStorageService.storeData('Translation', allTranslationData.value);
}, { deep: true });
</script>

<style scoped>
.advent-card-container {
  height: 100%; /* Make each card take the full height of the container */
  display: flex;
  justify-content: center;
  align-items: center;
}


.advent-card {
  width: 150px;
  height: 150px;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.8s, box-shadow 0.3s;
  box-shadow: 0 15px 20px rgba(0, 0, 0, 0.5); /* Add shadow */
  border-radius: 10px;
}

.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-front {
  background-color: #f5a623;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  border-radius: 10px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.advent-card.opened {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2); /* Change the shadow for opened state */
  filter: grayscale(80%); /* Optionally make the card appear "grayed out" */
}

.opened-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1); /* Semi-transparent overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
</style>
