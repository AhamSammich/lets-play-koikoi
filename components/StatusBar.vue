<script setup lang="ts">
const props = defineProps<{
  roundNum: number;
  score: { p1: number; p2: number };
  oya: string;
}>();

const activeP = STORE.useActiveP();

function pointToActive() {
  return activeP.value === "p1" ? "point-left" : "point-right";
}
</script>

<template>
  <header id="status" class="flex items-center justify-around p-4 fixed top-0 text-white z-10">
    <div id="p1-score" :class="{
      'is-oya': props.oya === 'p1', 'active-player': activeP === 'p1' }">
      <p>PLAYER 1</p>
      <img v-show="props.oya === 'p1'" loading="lazy" src="/images/webp/peony.webp" alt="The oya is Player 1." />
      <p>{{ score.p1 }}</p>
    </div>
    <div id="round-num" class="">
      <p>ROUND</p>
      <p>{{ roundNum }}</p>
      <div id="turn-pointer" :class="pointToActive()"></div>
    </div>
    <div id="p2-score" :class="{ 'is-oya': props.oya === 'p2', 'active-player': activeP === 'p2' }">
      <p>PLAYER 2</p>
      <img v-show="props.oya === 'p2'" loading="lazy" src="/images/webp/peony.webp" alt="The oya is Player 2." />
      <p>{{ score.p2 }}</p>
    </div>
  </header>
</template>

<style scoped lang="postcss">
#status {
  transform-origin: top;
  transition: all 0.5s;
  scale: 0.8;

  & > div {
    opacity: 0.7;
  }

  & .active-player {
    opacity: 1;
    scale: 1.1;
  }

  @media (orientation: portrait) {
    width: 100vw;
    max-width: var(--tbl-w-max);
    left: 0;
  }

  @media (orientation: landscape) {
    transform-origin: right;
    flex-direction: column;
    justify-content: center;
    gap: 4rem;
    height: 100vh;
    height: 100dvh;
    right: 99%;
    rotate: 180deg;
    width: max-content;

    &:hover {
      scale: none;
      opacity: 1;
    }

    &>* {
      rotate: 180deg;
    }
  }
}

p {
  font-weight: bold;
  font-size: larger;
  text-align: center;
  text-shadow: 0 0 0.2rem var(--tbl-black);

  &:is(:first-child) {
    font-size: small;
  }
}

#p1-score,
#p2-score {
  position: relative;

  & img {
    width: 40px;
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 0;
    translate: -50% -50%;
  }
}

#turn-pointer {
  --pointer-color: rgb(254 240 138 / 1);
  border-radius: 50%;
  height: 50px;
  width: 50px;
  position: absolute;
  border-bottom: 5px solid var(--pointer-color);
  top: 90%;
  left: 50%;
  translate: -50% -50%;
  transform-origin: center top;
  transition: all 0.5s;
  z-index: 20;

  @media (orientation: landscape) {
    top: 100%;
    transform: rotate(-90deg);
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 47px;
    left: 13px;
    width: 24px;
    border-top: 10px solid var(--pointer-color);
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
  }

  &.point-left {
    rotate: 90deg;
  }

  &.point-right {
    rotate: -90deg;
  }
}
</style>
