<template>
  <Menu />
  <NuxtPage />
</template>

<style lang="postcss">
:root {
  --tbl-black: rgb(14, 20, 34);
  --gradient-gold: linear-gradient(15deg, gold, palegoldenrod, lightgoldenrodyellow);
}

* {
  --tbl-w-max: 1000px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  &::-webkit-scrollbar {
    width: 0.2rem;
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gradient-gold);
  }
}

body {
  background-color: var(--tbl-black);
  overflow-x: hidden;
  width: 100%;
  font-family: Rubik, Verdana, sans-serif;
  user-select: none;
}

dialog {
  background: rgba(14, 20, 34, 0.95);
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-size: large;
  z-index: 25;
  transition: all 0.1s;

  & .btn-bar {
    margin-top: 0.5rem;
    /* width: 100%; */
    display: flex;
    gap: 2rem;
    justify-content: center;
    pointer-events: all;
    position: fixed;
    bottom: 10%;

    & button {
      outline: 1px solid yellow;
      border-radius: 0.2rem;
      background: firebrick;
      padding: 0.5em 1em;
      font-weight: bold;
      font-size: smaller;

      &:hover,
      &:focus-visible {
        transform: translate3d(0, 5%, 0);
        box-shadow: 0 0 0 0.5rem var(--tbl-black), 0 0 0 0.55rem gold;
      }
    }
  }

  & h1,
  & h2 {
    font-weight: bold;
    font-size: larger;
    text-transform: uppercase;
  }

  & h1 {
    font-family: "Potta One", cursive;
    letter-spacing: 0.05em;
  }

  & h2 {
    font-size: inherit;
  }
}

.hidden {
  display: none;
  scale: 1 0;
}
</style>
