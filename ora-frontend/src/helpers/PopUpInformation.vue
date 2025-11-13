<template>
    <transition name="fade">
        <div v-if="isVisible" :class="['popup', typeClass]" @mouseenter="pauseTimer" @mouseleave="resumeTimer">
            <div class="popup-content">
                <span class="icon">
                    <i :class="iconClass"></i>
                </span>
                <p class="message">{{ message }}</p>
                <span class="close-btn" @click="closePopup">&times;</span>
            </div>
            <!-- Barre de progression -->
            <div class="progress-bar">
                <div class="progress" :style="{ width: progressWidth + '%' }"></div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import PropTypes from 'vue-types';
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation';

const props = defineProps({
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['INFO', 'ERROR', 'WARNING', 'SUCCESS']).isRequired
});

const popUpStore = usePopUpStore();

const isVisible = ref(true);

// Durée totale
const totalTime = 6000;
let timerId = null;
let remainingTime = totalTime;
let startTime = null;

const typeClass = computed(() => {
    switch (props.type) {
        case 'INFO': return 'popup-info';
        case 'SUCCESS': return 'popup-success';
        case 'ERROR': return 'popup-error';
        case 'WARNING': return 'popup-warning';
        default: return '';
    }
});

const iconClass = computed(() => {
    switch (props.type) {
        case 'INFO': return 'fas fa-info-circle';
        case 'SUCCESS': return 'fas fa-check-circle';
        case 'ERROR': return 'fas fa-exclamation-circle';
        case 'WARNING': return 'fas fa-exclamation-triangle';
        default: return '';
    }
});

const closePopup = () => {
    isVisible.value = false;
    popUpStore.close();
};

// Progression (%)
const progressWidth = ref(100);
let progressInterval = null;

const updateProgress = () => {
    progressWidth.value = (remainingTime / totalTime) * 100;
};

// Timer principal
const startTimer = () => {
    startTime = Date.now();
    timerId = setTimeout(() => {
        closePopup();
    }, remainingTime);

    // Mise à jour de la barre toutes les 50ms
    progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progressWidth.value = ((remainingTime - elapsed) / totalTime) * 100;
    }, 50);
};

const pauseTimer = () => {
    clearTimeout(timerId);
    clearInterval(progressInterval);
    remainingTime -= Date.now() - startTime;
};

const resumeTimer = () => {
    startTimer();
};

onMounted(() => {
    startTimer();
});

onUnmounted(() => {
    clearTimeout(timerId);
    clearInterval(progressInterval);
});
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.popup {
    position: fixed;
    top: 20px;
    right: 20px;
    min-width: 300px;
    max-width: 400px;
    padding: 15px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(-20px);
}

.popup-content {
    display: flex;
    align-items: center;
    padding-left: 12px;
    padding-right: 12px;
    width: 100%;
    position: relative;
}

.icon {
    margin-right: 15px;
    font-size: 24px;
}

.message {
    flex: 1;
    font-size: 16px;
    color: inherit;
}

.close-btn {
    position: absolute;
    right: 0px;
    cursor: pointer;
    font-size: 20px;
    color: inherit;
    transition: color 0.3s;
}

.close-btn:hover {
    color: #000;
}

/* Progress bar */
.progress-bar {
    position: relative;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: rgba(255,255,255,0.3);
    overflow: hidden;
    margin-top: 10px;
}

.progress {
    height: 100%;
    background: rgba(255,255,255,0.8);
    transition: width 0.05s linear;
}

/* Types de popup */
.popup-info {
    background-color: #2196F3;
    color: #ffffff;
}

.popup-success {
    background-color: #4CAF50;
    color: #ffffff;
}

.popup-error {
    background-color: #F44336;
    color: #ffffff;
}

.popup-warning {
    background-color: #FF9800;
    color: #ffffff;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.fade-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 480px) {
    .popup {
        right: 10px;
        left: 10px;
        width: auto;
    }
}
</style>
