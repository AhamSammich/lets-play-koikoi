<script setup lang="ts">
const started = STORE.useStart();

function randomCards(): string[] {
  let randomArr: string[] = [];
  for (let i = 0; i < 5; i++) {
    let randomCard = pickCardFromArr(CARDS);
    randomArr.includes(randomCard)
      ? i--
      : randomArr.push(randomCard);
  }
  return randomArr;
}

function startGame() {
  started.value = true;
}
</script>

<template>
  <section
    id="start-page"
    :class="`${started ? '' : 'show'} flex flex-col align-center justify-center gap-8`"
  >
    <div
      id="hero-cards"
      :class="{'flex justify-center z-0 -rotate-12': true, 'opacity-0': started}"
    >
      <Card v-for="cardName in randomCards()" :key="cardName" :name="cardName" />
    </div>
    <h1 id="hero-title" class="text-center"><span>Let's Play!</span>花札 KOI-KOI</h1>
    <button id="start-btn" @click="startGame()">START</button>
  </section>
</template>

<style scoped lang="postcss">
section {
  overflow: hidden;
  transform-origin: bottom;
  height: 0;
  opacity: 0;
  transition: all 1s;

  &.show {
    height: 100vh;
    height: 100dvh;
    opacity: 1;
    animation: fadeIn 3s;
  }

  &.show #hero-title {
    translate: 0 0;
    transition: opacity 0.5s;
    opacity: 1;
  }

  &.show #hero-cards>* {
    opacity: 1;
  }
}

#hero-cards > * {
  transform-origin: bottom;
  max-width: 50px;

  &:nth-child(1) {
    rotate: -30deg;
    translate: 20px 20px;
  }

  &:nth-child(2) {
    rotate: -15deg;
    translate: 10px 5px;
  }

  &:nth-child(3) {
    rotate: 0deg;
  }

  &:nth-child(4) {
    rotate: 15deg;
    translate: -10px 5px;
  }

  &:nth-child(5) {
    rotate: 30deg;
    translate: -20px 20px;
  }
}

#hero-title {
  background: var(--gradient-gold);
  background-clip: text;
  color: transparent;
  font-family: "Potta One", "Mochiy Pop One", Verdana, sans-serif;
  font-size: 56px;
  max-width: 500px;
  margin: 0 auto;
  z-index: 1;
  opacity: 0;

  & span {
    text-align: right;
    display: block;
    font-size: 20px;
    color: white;
    font-style: italic;
  }
}

button {
  outline: 1px solid gold;
  border-radius: 0.2rem;
  background: firebrick;
  padding: 0.5em 1em;
  font-weight: bold;
  width: 150px;
  height: 75px;
  margin: 0 auto;
  color: #eee;
  text-align: center;
  z-index: 1;

  &:hover,
  &:focus {
    transform: translate3d(0, 5%, 0);
    box-shadow: 0 0.1rem 0.3rem 0 lightgoldenrodyellow;
  }
}

@media (orientation: landscape) {
  section {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 3rem;
  }

  button,
  #hero-title {
    margin: unset;
  }

  #hero-cards {
    display: flex;
    flex-direction: column;
    justify-content: flex-evenly;
    align-items: flex-start;
    rotate: -45deg;
    gap: 0;

    & > * {
      transform-origin: center;
      opacity: 0;
      
      &:nth-child(1) {
        rotate: 50deg;
        translate: 25px 230%;
      }

      &:nth-child(2) {
        rotate: 15deg;
        translate: -20px 90%;
      }

      &:nth-child(3) {
        rotate: 10deg;
        translate: -50px 90%;
      }

      &:nth-child(4) {
        rotate: 45deg;
        translate: -5px 20%;
      }

      &:nth-child(5) {
        rotate: 25deg;
        translate: -10px -155%;
      }
    }
  }
}
</style>
