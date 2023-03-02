<script setup lang="ts">
import { Ref } from "vue";

const collection1: Ref<string[]> = STORE.useCollection1();
const collection2: Ref<string[]> = STORE.useCollection2();
const completedYaku: Ref<Dict> = STORE.useYaku1();
const viewingsAllowed: Ref<number> = RULES.useViewingsAllowed();
const restrictedSet = new Set(["hanami-zake", "tsukimi-zake"]);
function isComplete(yakuName: string) {
  if (completedYaku.value[yakuName]) return "complete";
  else return "";
}

function allowedYaku(): YakuDetails[] {
  if (viewingsAllowed.value) return YAKU_LIB;
  return YAKU_LIB.filter((yaku) => !restrictedSet.has(yaku.name));
}
</script>

<template>
  <div
    class="relative w-full flex flex-col items-center overflow-y-scroll overflow-x-hidden"
  >
    <div v-for="(yaku, index) in allowedYaku()" :key="index" class="yaku-progress">
      <h1 :class="`yaku-name ${isComplete(yaku.name)} text-yellow-100`">
        {{ yaku.name }}
      </h1>
      <img
        v-if="isComplete(yaku.name)"
        src="~/assets/images/coin.png"
        alt="coin for a completed yaku"
        loading="lazy"
        class="coin absolute"
      />
      <h2 class="yaku-points">
        {{ yaku.points }} <span>{{ `${yaku.points === 1 ? " point" : " points"}` }}</span>
      </h2>
      <template v-if="yaku.description">
        <p v-for="line in yaku.description" :key="line" class="yaku-description">
          {{ line }}
        </p>
      </template>
      <div v-if="yaku.cards" class="yaku-cards mt-1">
        <Card
          v-for="card in yaku.cards"
          :key="card"
          :name="card"
          :class="{
            'opacity-30 translate-y-1': !collection1.includes(card),
            unavailable: collection2.includes(card),
          }"
          :data-name="getName(card)"
        />
      </div>
      <p
        v-if="
          viewingsAllowed === 1 &&
          restrictedSet.has(yaku.name) &&
          Object.keys(completedYaku).length === 0
        "
        class="note mt-4 text-xs max-w-prose whitespace-nowrap font-mono"
      >
        <Icon name="mdi:info-outline" class="pointer-events-none mr-1" />
        Requires at least one other<br /><span class="pl-6"
          >completed yaku ( not
          {{ [...restrictedSet].filter((name) => name != yaku.name)[0].toUpperCase() }}
          )</span
        >
      </p>
    </div>
    <div id="legend" class="fixed bottom-4 right-4 flex flex-col gap-1 items-center">
      <div>
        <Card name="kiri-no-kasu-1" class="opacity-30 unavailable" />
        <p>uncollectible</p>
      </div>
      <div>
        <Card name="kiri-no-kasu-1" class="opacity-30" />
        <p>collectible</p>
      </div>
      <div>
        <Card name="kiri-no-kasu-1" />
        <p>collected</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.yaku-progress {
  width: 400px;
  height: max-content;
  padding: 1.5rem;
  padding-right: 5rem;
  font-size: small;
  color: white;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 100px;
  grid-template-areas:
    "name points"
    "desc desc"
    "cards cards"
    "note note";
}

@media (orientation: landscape) {
  :has(> .yaku-progress) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
}

#legend {
  transform-origin: bottom right;
  transition: scale 0.3s;

  &:hover {
    scale: 1.5;
  }

  & .card {
    --card-width: 30px;
  }

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  & p {
    font-size: x-small;
    font-family: Consolas;
    margin-top: -0.5rem;
    background: var(--tbl-black);
    z-index: 1;
  }
}

.coin {
  height: 24px;
  width: 24px;
  top: 1.5rem;
  left: 50%;
}
.yaku-name {
  grid-area: name;
}
.note {
  grid-area: note;
  transition: scale 0.3s;
  transform-origin: left;

  &:hover {
    scale: 1.3;
  }
}
.yaku-points {
  grid-area: points;
  text-align: right;
  padding-right: 2rem;
}
.yaku-description {
  grid-area: desc;
  color: rgb(255 255 255 / 0.9);
}

.yaku-cards {
  grid-area: cards;
  max-width: 320px;
  display: flex;
  gap: 0.3rem;
  justify-content: flex-start;
  flex-wrap: wrap;

  & > * {
    --card-width: 50px;
    position: relative;
    animation: none;

    &[data-name]::after {
      content: "";
      position: absolute;
      display: block;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: lightgoldenrodyellow;
      font-size: x-small;
      padding: 0.5em;
      text-transform: uppercase;
      text-align: center;
      min-width: 100%;
      z-index: 2;
    }

    &[data-name]:hover::after {
      content: attr(data-name);
      background-color: var(--tbl-black);
      opacity: 1;
    }
  }
}

.unavailable {
  position: relative;
  rotate: -2deg;
  translate: 0 3%;
  z-index: 0;

  &::before {
    content: "";
    display: block;
    width: var(--card-width);
    aspect-ratio: 2/3;
    background: rgb(0 0 0 / 0.7);
    border: 1px solid red;
    border-radius: 0.3rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}

h1.complete {
  background: var(--gradient-gold);
  color: transparent;
  background-clip: text;
  position: relative;
}

h2 span {
  font-size: x-small;
  text-transform: lowercase;
}

.icon {
  scale: 1.8;
  color: gold;

  &:hover {
    color: firebrick;
    cursor: pointer;
  }
}
</style>
