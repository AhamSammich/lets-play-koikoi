<script setup lang="ts">
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

</script>

<template>
  <div :class="{ 'no-animation': noAnimation }">
    <div v-if="!name" class="down card"></div>
    <div v-else>
      <img
        placeholder=""
        class="card"
        :loading="loading"
        :src="imgUrl"
        :alt="name"
        @load="$emit('img-loaded')"
        sizes="sm:80px md:120px lg:150px"
      />
    </div>
  </div>
</template>

<style scoped>
.no-animation * {
  transition-duration: 0ms !important;
  transition-delay: 0ms !important;
  animation-duration: 0ms !important;
  animation-delay: 0ms !important;
}
</style>
