
<template>
  <Dialog
      v-model:visible="visible"
      modal
      :closable="false"
      :style="{ width: '50rem', borderRadius: '15px', padding: '1rem' }"
  >
    <div class="dialog-container">
      <h3 class="dialog-title">{{ topic }}</h3>
      <h4 class="dialog-subtitle">Match the Vocabulary</h4>

      <!-- Display English words -->
      <ul class="vocabulary-list">
        <li v-for="(word, index) in vocabulary" :key="index" class="vocabulary-item">
          <strong class="term">{{ word.term }}</strong>
          <div
              class="drop-zone"
              :class="{ correct: word.matched, incorrect: word.matched === false }"
              @drop.prevent="(event) => onDrop(index, event)"
              @dragover.prevent
          >
            <span v-if="word.matched">{{ word.translation }}</span>
            <span v-else>Drop Here</span>
          </div>
        </li>
      </ul>

      <!-- Draggable German words -->
      <h4 v-if="germanWords.length > 0" class="drag-instructions">Drag the German words to their English counterparts:</h4>
      <draggable
          v-model="germanWords"
          group="words"
          class="german-word-list"
          :clone="cloneWord"
      >
        <div
            v-for="(word, index) in germanWords"
            :key="index"
            class="german-word-item"
            draggable="true"
            @dragstart="(event) => onDragStart(event, word)"
        >
          {{ word }}
        </div>
      </draggable>
    </div>
    <Button label="Close" icon="pi pi-times" @click="closeDialog" class="p-button-rounded p-button-danger close-button" />
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
  vocabulary: Array,
  topic: String,
  visible: Boolean,
});

const draggable = VueDraggableNext;

const emit = defineEmits(['closeDialog', 'dayCompleted']);

const confettiVisible = ref(false);
const visible = ref(props.visible);

// Track German words for dragging
const germanWords = ref([]);

// Handle drag start to attach data
const onDragStart = (event, translation) => {
  event.dataTransfer.setData('word', translation);
};

// Handle drop event to match words
const onDrop = (index, event) => {
  const droppedWord = event.dataTransfer.getData('word');
  if (props.vocabulary[index].translation === droppedWord) {
    props.vocabulary[index].matched = true;
    germanWords.value = germanWords.value.filter(word => word !== droppedWord);
  } else {
    props.vocabulary[index].matched = false;
  }

  if(germanWords.value.length === 0) {
    explode()
    emit('dayCompleted');
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
    // only get the words where the matched property is false
    germanWords.value = props.vocabulary.filter(word => !word.matched).map(word => word.translation);
  }
});

// Clone a German word for draggable use
const cloneWord = (word) => ({ ...word });

const closeDialog = () => {
  emit('closeDialog');
};
</script>

<style scoped>
.confetti-container {
  position: absolute;
  right: 50%;
  top: 50%;
}

.dialog-container {
  text-align: center;
}
.vocabulary-list {
  list-style: none;
  padding: 0;
}
.vocabulary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.drop-zone {
  border: 2px dashed #ccc;
  padding: 0.5rem;
  width: 200px;
  text-align: center;
  border-radius: 5px;
}
.drop-zone.correct {
  border-color: green;
  background-color: #e6ffe6;
}
.drop-zone.incorrect {
  border-color: red;
  background-color: #ffe6e6;
}
.german-word-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
.german-word-item {
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: grab;
}
</style>
