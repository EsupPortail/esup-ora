<template>
    <transition name="fade">
        <div 
            v-show="popUpData.isVisible" 
            :class="['popup', typeClass]" 
            @mouseenter="pauseTimer" 
            @mouseleave="resumeTimer"
        >
            <div class="popup-content">
                <span class="icon"><i :class="iconClass"></i></span>
                
                <div class="message-container">
                    <p 
                        v-for="(line, index) in popUpData.message?.split('\n')" 
                        :key="index" 
                        class="message-line"
                    >
                        {{ line }}
                    </p>
                </div>

                <span class="close-btn" @click="closePopup">&times;</span>
            </div>
            <div class="progress-bar">
                <div class="progress" :style="{ width: progressWidth + '%' }"></div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation';

const popUpStore = usePopUpStore();
const { popUpData } = storeToRefs(popUpStore);

const totalTime = 6000;
const progressWidth = ref(100);
let timerId = null;
let progressInterval = null;
let remainingTime = totalTime;
let startTime = null;

const typeClass = computed(() => `popup-${popUpData.value.type?.toLowerCase() || 'info'}`);

const iconClass = computed(() => {
    const icons = {
        INFO: 'fas fa-info-circle',
        SUCCESS: 'fas fa-check-circle',
        ERROR: 'fas fa-exclamation-circle',
        WARNING: 'fas fa-exclamation-triangle'
    };
    return icons[popUpData.value.type] || icons.INFO;
});

const stopAllTimers = () => {
    clearTimeout(timerId);
    clearInterval(progressInterval);
};

const closePopup = () => {
    stopAllTimers();
    popUpStore.close();
};

const startTimer = () => {
    stopAllTimers();
    startTime = Date.now();
    
    timerId = setTimeout(() => {
        closePopup();
    }, remainingTime);

    progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = ((remainingTime - elapsed) / totalTime) * 100;
        progressWidth.value = Math.max(0, currentProgress);
    }, 16); 
};

const pauseTimer = () => {
    stopAllTimers();
    remainingTime -= (Date.now() - startTime);
};

const resumeTimer = () => {
    if (remainingTime > 0) startTimer();
};

watch(() => [popUpData.value.isVisible, popUpData.value.message], ([visible, message]) => {
    if (visible && message) {
        remainingTime = totalTime;
        progressWidth.value = 100;
        startTimer();
    } else {
        stopAllTimers();
    }
}, { immediate: true });

onUnmounted(stopAllTimers);
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.popup {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 320px;
    max-width: 90vw;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    display: flex;
    flex-direction: column;
}

.popup-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.icon { font-size: 20px; }
.message { flex: 1; margin: 0; font-weight: 500; }
.close-btn { cursor: pointer; font-size: 22px; opacity: 0.7; }
.close-btn:hover { opacity: 1; }

.progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    margin-top: 12px;
    border-radius: 2px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background: #fff;
    transition: none; 
}

.popup-info { background: #3182ce; color: white; }
.popup-success { background: #38a169; color: white; }
.popup-error { background: #e53e3e; color: white; }
.popup-warning { background: #dd6b20; color: white; }

.fade-enter-active, .fade-leave-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -30px);
}
</style>