<script setup lang="ts">
// This is a card that does not require interaction from the user.
// If no name is passed to props, card will be face-down.
import { useImage } from "@vueuse/core";
import { useDesignStore } from "~~/stores/designStore";
const props = defineProps<{
  name?: string;
  design?: string;
  loading?: "lazy" | "eager";
}>();

const designStore = useDesignStore();

const activeDesign = computed(() => designStore.activeDesign);
const appliedDesign = computed(() => props.design || activeDesign.value);
const hasCardBack = computed(() => designStore.hasBackImage);

const imgUrl = computed(() => `cards/${appliedDesign.value}/webp/${props.name}.webp`);
const backImgUrl = computed(() => `cards/${appliedDesign.value}/webp/card-back.webp`);

const isLoading = props.name ? useImage({ src: imgUrl.value }).isLoading : false;
</script>

<template>
  <div class="no-animate">
    <!-- Render card face-down -->
    <nuxt-img
      v-if="!name && hasCardBack"
      preset="card"
      class="card rotate-180"
      :loading="loading || 'lazy'"
      :src="backImgUrl"
      alt="face-down card"
    />
    <div v-else-if="!name" class="down card"></div>

    <!-- Render card face-up -->
    <div v-else-if="isLoading" class="card loading"></div>
    <div v-else>
      <nuxt-img
        preset="card"
        class="card"
        :loading="loading || 'lazy'"
        :src="`cards/${appliedDesign}/webp/${props.name}.webp`"
        :alt="name"
      />
    </div>
  </div>
</template>

<style scoped>
/* Uses global css variables */
/* @import url(~assets/css/card-styles.css); */
.no-animate * {
  transition-duration: 0ms !important;
  transition-delay: 0ms !important;
  animation-duration: 0ms !important;
  animation-delay: 0ms !important;
}
</style>
