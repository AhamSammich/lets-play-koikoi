<script setup lang="ts">
import { addDetails } from "~~/assets/scripts/match";

const props = defineProps<{
  name: string;
}>();

const emits = defineEmits(["card-select"]);

function handleClick(e: Event) {
  // let card = <HTMLElement> e.target;
  // card.classList.add("selected");
  emits("card-select", props.name);
}

function setImage() {
  return `background-image: url(cards/${props.name}.png)`;
}
</script>

<template>
  <div class="card" :style="setImage()" @click="handleClick"></div>
</template>

<style lang="postcss">
.card {
  width: 75px;
  height: 113px;
  background-size: contain;
  background-repeat: no-repeat;
  outline: 1px solid #111;
  border-radius: 0.2rem;
  transition: transform 0.5s 0.2s;

  &:hover {
    cursor: pointer;
    transform: translate3d(0, -30%, 0);
  }
}
</style>
