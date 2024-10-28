<template>
  <Dialog
      v-model:visible="visible"
      modal
      :closable="false"
      :style="{ width: '40rem', borderRadius: '15px', padding: '1rem' }"
  >
    <div class="dialog-container">
      <h3 class="dialog-title">{{ topic }}</h3>
      <h4 class="dialog-subtitle">Listening</h4>

      <div class="animation-container">
        <div class="snowman-wrapper">
          <Vue3Lottie :animationData="snowmanJSON" class="snowman"/>
          <div v-if="currentAudioIndex % 2 === 0 && currentText" class="speech-bubble">{{ currentText }}</div>
        </div>
        <div class="snowman-wrapper">
          <Vue3Lottie :animationData="snowmanJSON" class="snowman"/>
          <div v-if="currentAudioIndex % 2 !== 0 && currentText" class="speech-bubble">{{ currentText }}</div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <Button label="Close" icon="pi pi-times" @click="closeDialog" class="p-button-rounded p-button-danger close-button" />
      <Button v-if="!isPlaying" label="Play Audio" icon="pi pi-play" @click="playAudio" class="p-button-rounded p-button-success close-button" />
      <Button v-else label="Stop Audio" icon="pi pi-stop" @click="stopAudio" class="p-button-rounded p-button-danger close-button" />
    </div>
  </Dialog>
</template>

<script setup>
import {ref, watch} from 'vue';
import {Vue3Lottie} from "vue3-lottie";

import snowmanJSON from "@/assets/animations/snowman.json";

const props = defineProps({
  topic: String,
  visible: Boolean,
  listening: Array
});

const emit = defineEmits(['closeDialog']);
const visible = ref(props.visible);

const isPlaying = ref(false);
let audio = new Audio();
const audioSrc = ref('');
const currentText = ref('');
const currentAudioIndex = ref(0);

watch(() => props.visible, (newVal) => {
  visible.value = newVal;
});

const closeDialog = () => {
  audio.pause();
  audio.src = '';
  currentText.value = "";
  emit('closeDialog');
};

const loadAudio = () => {
  if (currentAudioIndex.value < props.listening.length) {
    audioSrc.value = `/src/assets/data/audio/${props.listening[currentAudioIndex.value].file}`;
    currentText.value = props.listening[currentAudioIndex.value].text;
  }
};

const playAudio = () => {
  loadAudio();
  if(audioSrc.value) {
    audio.src = audioSrc.value;
    audio.play();
    isPlaying.value = true;
    audio.onended = () => {
      playNextAudio();
    };
  }
};

const playNextAudio = () => {
  currentAudioIndex.value++;
  if (currentAudioIndex.value < props.listening.length) {
    playAudio();
  } else {
    stopAudio();
    currentText.value = "";
    currentAudioIndex.value = 0;
  }
};

const stopAudio = () => {
  if (audio) {
    audio.pause();
  }
  isPlaying.value = false;
};
</script>

<style scoped>
.close-button {
  width: 40%;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.animation-container {
  display: flex;
  justify-content: space-around;

  .snowman-wrapper {
    position: relative;
  }

  .snowman {
    height: 200px;
    width: 200px;
  }
}

.speech-bubble {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ece5ce;
  border-radius: 11px;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 15px;
  color: #774f38;
  box-shadow: 20px 20px #83af9b;
  font-family: "Baloo 2", cursive;
  animation: float 5s ease-in-out infinite;
}

.speech-bubble:after {
  content: ".";
  font-weight: bold;
  -webkit-text-fill-color: #ece5ce;
  text-shadow: 22px 22px #83af9b;
  text-align: left;
  font-size: 55px;
  width: 55px;
  height: 11px;
  line-height: 30px;
  border-radius: 11px;
  background-color: #ece5ce;
  position: absolute;
  display: block;
  bottom: -30px;
  left: 0;
  box-shadow: 22px 22px #83af9b;
  z-index: -2;
  animation: float2 5s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes float2 {
  0% {
    line-height: 30px;
    transform: translateY(0px);
  }
  55% {
    transform: translateY(-20px);
  }
  60% {
    line-height: 10px;
  }
  100% {
    line-height: 30px;
    transform: translateY(0px);
  }
}
</style>
