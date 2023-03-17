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

const hasCardBack = computed(() => designStore.hasBackImage);

const imgUrl = computed(() => {
  if (props.name || hasCardBack.value)
    return `cards/${props.design || activeDesign.value}/webp/${
      props.name ? props.name : "card-back"
    }.webp`;
});

const isLoading = imgUrl.value ? useImage({ src: imgUrl.value }).isLoading : false;
</script>

<template>
  <div v-if="!name && !hasCardBack" class="down card"></div>
  <div v-else-if="isLoading" class="card loading"></div>
  <div v-else>
    <nuxt-img
      preset="card"
      class="card"
      :loading="loading || 'lazy'"
      :src="imgUrl"
      :alt="name || 'face-down card'"
    />
  </div>
</template>

<style scoped>
/* Uses global css variables */
/* @import url(~assets/css/card-styles.css); */
</style>
