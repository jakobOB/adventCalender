<template>
  <Dialog
      v-model:visible="visible"
      modal
      :closable="false"
      :style="{ minWidth: '40rem',borderRadius: '15px', padding: '1rem' }"
  >
    <div class="dialog-container">
      <h3 class="dialog-title">{{ topic }}</h3>
      <h4 class="dialog-subtitle">Translation</h4>
      <p v-if="!done" class="dialog-description">Drag the words in corrects order into the box.</p>

      <!-- Draggable Container -->
      <div v-if="!done" class="sentence-builder">
        <div class="sentence-progress">
          <span>Finished Sentences:</span>
          <span class="progress-count">{{ currentTranslationIndex }} / {{ translations.length }}</span>
        </div>
        <!-- German Text Display -->
        <div class="german-translation">
          <span>{{ germanTranslation }}</span>
        </div>

        <!-- Draggable Words -->
        <div class="drop-zones">
          <draggable
              v-model="dropZones"
              group="words"
              tag="div"
              class="drop-zone-container"
              :options="{ animation: 200 }"
          >
            <div
                v-for="(word, index) in dropZones"
                :key="index"
                class="drop-word"
                style="border: 2px dashed #aaa;"
            >
              {{ word }}
            </div>
          </draggable>
        </div>

        <div class="drop-zones">
          <draggable
              v-model="remainingWords"
              group="words"
              tag="div"
              class="drop-zone-container"
              :options="{ animation: 200 }"
          >
            <div
                v-for="(word, index) in remainingWords"
                :key="index"
                class="drop-word"
                style="border: 1px solid #ccc;"
            >
              {{ word }}
            </div>
          </draggable>
        </div>
      </div>

      <div v-else class="sentence-builder">
        <p>Well done! You have completed all translations.</p>
      </div>

    </div>
    <div class="button-container">
      <Button label="Close" icon="pi pi-times" @click="closeDialog" class="p-button-rounded p-button-danger close-button" />
      <Button label="Check" icon="pi pi-check" @click="checkAnswer" class="p-button-rounded p-button-success close-button check-button" />
    </div>
    <div class="confetti-container">
      <ConfettiExplosion v-if="confettiVisible" :duration="2000" :particleCount="300" :force="1.0" :stageHeight="1000"/>
    </div>
  </Dialog>
</template>

<script setup>
import {nextTick, ref, watch} from 'vue';
import { VueDraggableNext } from 'vue-draggable-next'
import ConfettiExplosion from "vue-confetti-explosion";

const props = defineProps({
  translations: Array,
  topic: String,
  visible: Boolean,
  done: Boolean
});

const draggable = VueDraggableNext;
const emit = defineEmits(['closeDialog', 'dayCompleted']);
const visible = ref(props.visible);
const confettiVisible = ref(false);
const sentenceValid = ref(true);

const currentTranslationIndex = ref(0);
const germanTranslation = ref('')
const dropZones = ref([]);
const remainingWords = ref([]);
const correctSentence = ref([]);
const isCorrect = ref(false);
const allDone = ref(false);


const loadCurrentTranslation = () => {
  if (currentTranslationIndex.value <= props.translations.length - 1) {
    const currentTranslation = props.translations[currentTranslationIndex.value];
    germanTranslation.value = currentTranslation.german;
    if (currentTranslation) {
      dropZones.value = [];
      correctSentence.value = currentTranslation.english.split(" ");
      remainingWords.value = [...correctSentence.value].sort(() => Math.random() - 0.5);
      isCorrect.value = false;
    }
  }
  else {
    allDone.value = true;
    remainingWords.value = [];
    dropZones.value = [];
    explode();
    dayCompleted();
  }
};

const checkAnswer = () => {
  isCorrect.value = JSON.stringify(dropZones.value) === JSON.stringify(correctSentence.value);
  if(isCorrect.value) {
    props.translations[currentTranslationIndex.value].valid = 1;
    currentTranslationIndex.value++;
    loadCurrentTranslation();
  } else {
    sentenceValid.value = false;
  }
};

const explode = async () => {
  confettiVisible.value = false;
  await nextTick();
  confettiVisible.value = true;
};

watch(() => props.visible, (newVal) => {
  visible.value = newVal;
  if(newVal) {
    // count valid translations in props.translations
    props.translations.forEach((translation) => {
      if(translation.valid === 1) {
        currentTranslationIndex.value++;
      }
    });

    loadCurrentTranslation();
  } else {
    currentTranslationIndex.value = 0;
  }
});

const closeDialog = () => {
  emit('closeDialog');
};

const dayCompleted = () => {
  emit('dayCompleted');
};
</script>

<style scoped>
.dialog-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  color: #333;
}

.sentence-builder {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 20px;

  .sentence-progress {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 0.9rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .progress-count {
    font-weight: bold;
    color: #007bff;
  }

  .german-translation {
    font-size: 1rem;
    font-weight: 600;
    color: #495057;
    margin-bottom: 1rem;
  }
}

.drop-zone-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  height: 40px;
}

.drop-zones {
  min-width: 70%;
  min-height: 50px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  align-content: center;
  padding: 10px;
}

.drop-word {
  padding: 8px 12px;
  background-color: #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: grab;
}

.confetti-container {
  position: absolute;
  right: 50%;
  top: 50%;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.close-button {
  width: 40%;
}
</style>
