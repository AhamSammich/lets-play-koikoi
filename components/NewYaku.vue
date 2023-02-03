<script setup lang="ts">
const props = defineProps<{
  showModal: boolean;
  yaku: string
  cards: string[];
}>();

const emits = defineEmits(["koi-koi"]);

function callKoiKoi() {
    emits('koi-koi', true);
}

function endGame() {
    emits('koi-koi', false);
}
</script>

<template>
  <div :class="{modal: true, hidden: !showModal}">
    <h1>{{ yaku }}</h1>
    <div id="new-yaku">
      <template v-for="card in cards">
        <div>
          <Card
            :name="card"
          />
        </div>
      </template>
    </div>
    <div class="btn-bar">
        <button @click="callKoiKoi()">KOI KOI!</button>
        <button @click="endGame()">END ROUND</button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
#new-yaku {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 400px;
    gap: 0.2rem;
    pointer-events: none;
}

.modal {
  background: hsl(0 0% 13% / 0.9);
  width: 100%;
  height: 100vh;
  height: 100dvh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: white;
  font-size: x-large;
}

h1 {
    font-weight: bold;
    font-size: larger;
    text-transform: uppercase;
}

.btn-bar {
    width: 100%;
    max-width: 400px;
    display: flex;
    justify-content: space-around;
    pointer-events: all;

    & button {
        outline: 1px solid yellow;
        border-radius: 0.2rem;
        background: firebrick;
        padding: 0.5em 1em;
        font-weight: bold;
        font-size: smaller;

        &:hover {
            transform: translate3d(0, -5%, 0);
        }
    }
}

.hidden {
  display: none;
}
</style>