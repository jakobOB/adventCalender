<template>
  <Dialog
      v-model:visible="visible"
      :draggable="false"
      :closable="false"
      modal
      :style="{ width: '50rem', borderRadius: '15px', padding: '1rem' }"
  >
    <div class="dialog-container">
      <h3 class="dialog-title">{{ topic }}</h3>
      <h4 class="dialog-subtitle">Complete the Sentences</h4>
      <div class="sentence-completion">
        <div v-for="(sentence, index) in sentences" :key="index" class="sentence-item">
          <span>{{ sentence.before }}</span>
          <Dropdown
              v-model="sentence.selected"
              :options="words"
              placeholder="Select Word"
              class="sentence-dropdown"
              :class="{ 'p-invalid': sentence.invalid, 'p-correct': allCorrect }"
          />
          <span>{{ sentence.after }}</span>
        </div>
      </div>
    </div>
    <div class="button-container">
      <Button label="Close" icon="pi pi-times" @click="closeDialog" class="p-button-rounded p-button-danger close-button" />
      <Button label="Check" icon="pi pi-check" @click="check" class="p-button-rounded p-button-success close-button" />
    </div>
    <div class="confetti-container">
      <ConfettiExplosion v-if="confettiVisible" :duration="2000" :particleCount="300" :force="1.0" :stageHeight="1000"/>
    </div>
  </Dialog>
</template>

<script setup>
import {nextTick, ref, watch} from 'vue';
import ConfettiExplosion from "vue-confetti-explosion";

const props = defineProps({
  sentences: Array,
  words: Array,
  topic: String,
  visible: Boolean,
});

const emit = defineEmits(['closeDialog', 'dayCompleted']);
const visible = ref(props.visible);
const confettiVisible = ref(false);

const allCorrect = ref(false);

const check = () => {
  allCorrect.value = true;

  props.sentences.forEach(sentence => {
    sentence.invalid = sentence.selected !== sentence.solution;
    if(sentence.selected !== sentence.solution) allCorrect.value = false;
  });

  if (allCorrect.value) {
    explode();
    dayCompleted();
  }
}

const explode = async () => {
  confettiVisible.value = false;
  await nextTick();
  confettiVisible.value = true;
};

watch(() => props.visible, (newVal) => {
  visible.value = newVal;
});


const dayCompleted = () => {
  emit('dayCompleted');
};

const closeDialog = () => {
  emit('closeDialog');
};
</script>

<style scoped>
.sentence-item {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.p-invalid {
  border-color: red;
}
.p-correct {
  border-color: green;
}

.close-button {
  width: 40%;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.confetti-container {
  position: absolute;
  right: 50%;
  top: 50%;
}
</style>