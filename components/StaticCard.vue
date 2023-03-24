<script setup lang="ts">
// This is a card that does not require interaction from the user.
// If no name is passed to props, card will be face-down.
import { useImage } from "@vueuse/core";
import { useDesignStore } from "~~/stores/designStore";
const props = withDefaults(
  defineProps<{
    name?: string;
    design?: string;
    loading?: "lazy" | "eager";
    noAnimation?: boolean;
  }>(),
  {
    loading: "lazy",
    noAnimation: true,
  }
);

defineEmits(["img-loaded"]);

const activeDesignName = computed(() => useDesignStore().activeDesignName);

const imgUrl = computed(
  () => `cards/${props.design || activeDesignName.value}/webp/${props.name}.webp`
);

const isLoading = props.name ? useImage({ src: imgUrl.value }).isLoading : false;
</script>

<template>
  <div :class="{ 'no-animation': noAnimation }">
    <!-- Render card face-down -->
    <div v-if="!name" class="down card"></div>

    <!-- Render card face-up -->
    <div v-else-if="isLoading" class="card down loading"></div>
    <div v-else>
      <!-- <div> -->
      <nuxt-img
        preset="card"
        class="card"
        :loading="loading"
        :src="imgUrl"
        :alt="name"
        @load="$emit('img-loaded')"
      />
    </div>
  </div>
</template>

<style scoped>
/* Uses global css variables */
/* @import url(~assets/css/card-styles.css); */
.no-animation * {
  transition-duration: 0ms !important;
  transition-delay: 0ms !important;
  animation-duration: 0ms !important;
  animation-delay: 0ms !important;
}
</style>
