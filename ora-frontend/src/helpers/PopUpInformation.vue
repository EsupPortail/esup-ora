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
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import PropTypes from 'vue-types';
import { usePopUpStore } from '@/stores/popUp/PopUpStoreImplementation';

// Définition des props avec validation
const props = defineProps({
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['INFO', 'ERROR', 'WARNING', 'SUCCESS']).isRequired
});

// Initialisation du store
const popUpStore = usePopUpStore();

// État de visibilité du popup
const isVisible = ref(true);

// Calcul de la classe CSS en fonction du type de popup
const typeClass = computed(() => {
    switch (props.type) {
        case 'INFO':
            return 'popup-info';
        case 'SUCCESS':
            return 'popup-success';
        case 'ERROR':
            return 'popup-error';
        case 'WARNING':
            return 'popup-warning';
        default:
            return '';
    }
});

// Calcul de la classe de l'icône en fonction du type
const iconClass = computed(() => {
    switch (props.type) {
        case 'INFO':
            return 'fas fa-info-circle';
        case 'SUCCESS':
            return 'fas fa-check-circle';
        case 'ERROR':
            return 'fas fa-exclamation-circle';
        case 'WARNING':
            return 'fas fa-exclamation-triangle';
        default:
            return '';
    }
});

// Méthode pour fermer le popup
const closePopup = () => {
    isVisible.value = false;
    popUpStore.close();
};

// Référence pour stocker l'ID du timer
let timerId = null;
let remainingTime = 4000;
let startTime = null;

// Fonction pour démarrer le timer
const startTimer = () => {
    startTime = Date.now();
    timerId = setTimeout(() => {
        closePopup();
    }, remainingTime);
};

// Fonction pour mettre en pause le timer
const pauseTimer = () => {
    clearTimeout(timerId);
    remainingTime -= Date.now() - startTime;
};

// Fonction pour reprendre le timer
const resumeTimer = () => {
    startTimer();
};

// Configuration du timer pour fermer le popup après 4 secondes
onMounted(() => {
    startTimer();
});

// Nettoyage du timer si le composant est détruit avant la fin du délai
onUnmounted(() => {
    if (timerId) {
        clearTimeout(timerId);
    }
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
    align-items: center;
    opacity: 0;
    transform: translateY(-20px);
}

.popup-content {
    display: flex;
    align-items: center;
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
