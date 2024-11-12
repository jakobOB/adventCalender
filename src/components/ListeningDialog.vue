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

      </div>
      <div v-if="!done" class="audio-player">
        <!-- Audio Element (hidden) -->
        <audio id="player" ref="player" @ended="resetAudioValues" :src="audioSrc"></audio>
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${progressPercentage}%` }">
              <img src="@/assets/animations/sledge.png" class="sledge" alt="sledge"/>
            </div>
          </div>
        </div>
        <!-- Time Display -->
        <div class="time-display">
          <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
        </div>
        <!-- Single Choice Questions -->
        <div class="questions-container">
          <p style="font-weight: bold">{{listening[0].question}}</p>
          <div v-for="(option, idx) in listening[0].options" :key="idx" class="option">
            <input type="radio" :id="`option-${idx}`" :value="idx" v-model="selectedOption" />
            <label :for="`option-${idx}`">{{ option }}</label>
          </div>
          <Button label="Check Answer" @click="checkAnswer" class="p-button-rounded p-button-success check-button" />
        </div>
      </div>

      <div v-else class="audio-player">
        <p>Well done! You have completed this task amazingly.</p>
      </div>
    </div>
    <div class="button-container">
      <Button label="Close" icon="pi pi-times" @click="closeDialog" class="p-button-rounded p-button-danger close-button" />
      <Button v-if="!isPlaying" label="Play Audio" icon="pi pi-play" @click="playStopAudio" class="p-button-rounded p-button-success close-button" />
      <Button v-else label="Pause Audio" icon="pi pi-pause" @click="stopAudio" class="p-button-rounded p-button-danger close-button" />
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
  topic: String,
  visible: Boolean,
  done: Boolean,
  listening: Array
});

const emit = defineEmits(['closeDialog', 'dayCompleted']);
const visible = ref(props.visible);

const audioSrc = ref('');
const currentAudioIndex = ref(0);
const confettiVisible = ref(false);

const audio = ref();
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progressPercentage = ref(0);
const timeoutID = ref(null);

const selectedOption = ref(null);
const allDone = ref(false);

watch(() => props.visible, (newVal) => {
  visible.value = newVal;
});

function updateProgress() {
  currentTime.value = audio.value.currentTime;
  progressPercentage.value = (currentTime.value / duration.value) * 100;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

const closeDialog = () => {
  clearInterval(timeoutID.value);
  resetAudioValues();
  emit('closeDialog');
};

const dayCompleted = () => {
  emit('dayCompleted');
};

const resetAudioValues = () => {
  stopAudio();
  currentTime.value = 0;
  duration.value = 0;
  progressPercentage.value = 0;
  audioSrc.value = '';
};

const loadAudio = () => {
  if (currentAudioIndex.value < props.listening.length) {
    audioSrc.value = `/src/assets/data/audio/${props.listening[currentAudioIndex.value].file}`;
  }
};

const playStopAudio = () => {
  if(audioSrc.value) {
    if(isPlaying.value) {
      audio.value.pause()
    }
    else {
      audio.value.play()
    }
    isPlaying.value = !isPlaying.value
  } else {
    loadAudio();
    if(audioSrc.value) {
      audio.value = document.getElementById("player")
      audio.value.onloadedmetadata = () => {
        duration.value = audio.value.duration;
        audio.value.play();
        timeoutID.value = setInterval(updateProgress, 10);
      };
      isPlaying.value = true;
    }
  }
};

const stopAudio = () => {
  if (audio.value) {
    audio.value.pause();
  }
  isPlaying.value = false;
};

const checkAnswer = () => {
  if (selectedOption.value === props.listening[0].answer) {
    explode()
    allDone.value = true;
    dayCompleted();
  } else {
    alert('Wrong Answer!');
  }
};

const explode = async () => {
  confettiVisible.value = false;
  await nextTick();
  confettiVisible.value = true;
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
}

.audio-player {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-container {
  width: 100%;
  max-width: 400px;
  margin: 10px 0;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #3b82f6;
  position: relative;
}

.sledge {
  position: relative;
  left: 100%;
  height: 20px;
}

.time-display {
  font-size: 14px;
  margin-top: 5px;
}

.questions-container {
  margin-top: 20px;
  text-align: center;
}

.option {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.option input {
  margin-right: 10px;
}

.check-button {
  margin-top: 10px;
}

.confetti-container {
  position: absolute;
  right: 50%;
  top: 50%;
}
</style>
