<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <div class="circle">
          <img
            :class="{'rotate-left': rotateLeft, 'rotate-right': rotateRight}"
            src="../../assets/apc-logo.webp"
            alt="APC Logo"
            @mouseenter="rotate('left')"
            @mouseleave="resetRotation()"
            @click="rotate('right')"
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      rotateLeft: false,
      rotateRight: false,
    };
  },
  methods: {
    rotate(direction) {
      if (direction === 'left') {
        this.rotateLeft = true;
        this.rotateRight = false;
      } else if (direction === 'right') {
        this.rotateRight = true;
        this.rotateLeft = false;
      }
    },
    resetRotation() {
      this.rotateLeft = false;
      this.rotateRight = false;
    }
  }
};
</script>

<style scoped>
.circle img {
  border-radius: 50%;
  transition: transform 2s;
  min-width: 100px;
}

.rotate-left {
  transform: rotate(-360deg);
}

.rotate-right {
  transform: rotate(360deg);
}
</style>
