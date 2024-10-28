<template>
  <Dialog
      v-model:visible="visible"
      modal
      :closable="false"
      :style="{ width: '40rem', borderRadius: '15px', padding: '1rem' }"
  >
    <div class="dialog-container">
      <h3 class="dialog-title">{{ topic }}</h3>
      <h4 class="dialog-subtitle">Vocabulary</h4>
      <ul class="vocabulary-list">
        <li v-for="(word, index) in vocabulary" :key="index" class="vocabulary-item">
          <strong class="term">{{ word.term }}:</strong>
          <span class="translation">{{ word.translation }}</span>
        </li>
      </ul>
    </div>
    <Button label="Close" icon="pi pi-times" @click="closeDialog" class="p-button-rounded p-button-danger close-button" />
  </Dialog>
</template>

<script setup>
import {ref, watch} from 'vue';

const props = defineProps({
  vocabulary: Array,
  topic: String,
  visible: Boolean,
});
// add multiple emits
const emit = defineEmits(['closeDialog', 'dayCompleted']);
const visible = ref(props.visible);

watch(() => props.visible, (newVal) => {
  visible.value = newVal;
  dayCompleted()
});

const dayCompleted = () => {
  emit('dayCompleted');
};

const closeDialog = () => {
  emit('closeDialog');
};
</script>

<style scoped>
.vocabulary-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.vocabulary-item {
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.term {
  font-weight: 600;
  font-size: 18px;
  color: #2c3e50;
}

.translation {
  font-size: 16px;
  color: #95a5a6;
  text-align: right;
}
</style>
