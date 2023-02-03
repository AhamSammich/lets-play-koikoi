<script setup lang="ts">
const props = defineProps<{
  name: string;
  hide?: boolean;
}>();

const emits = defineEmits(["card-select"]);

function handleClick(e: Event) {
  emits("card-select", props.name);
}

function setImage() {
  return props.hide
    ? 'background: red;' 
    : `background-image: url(cards/${props.name}.png)`;
}
</script>

<template>
  <div :class="{ card: true, hide: hide }" :style="setImage()" @click="handleClick"></div>
</template>

<style lang="postcss">
.card {
  width: 75px;
  height: 113px;
  background-size: contain;
  background-repeat: no-repeat;
  outline: 1px solid #111;
  border-radius: 0.2rem;
  transition: transform 0.3s 0.1s;

  &:hover {
    cursor: pointer;
    transform: translate3d(0, -30%, 0);
  }
}

.hide {
  background-image: none;
  background-color: red;
}
</style>
