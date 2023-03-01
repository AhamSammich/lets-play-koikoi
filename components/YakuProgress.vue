<script setup lang="ts">
const collection1 = STORE.useCollection1();
const collection2 = STORE.useCollection2();
const yakuCompleted = STORE.useYaku1();
const viewingsAllowed = RULES.useViewingsAllowed();
const viewingsLimited = viewingsAllowed.value === 1;
const restrictedSet = new Set(["hanami-zake", "tsukimi-zake"]);

function isComplete(yakuName: string) {
  if (yakuCompleted.value[yakuName]) return "complete";
  else return "";
}

function allowedYaku(): YakuDetails[] {
  if (viewingsAllowed.value) return YAKU_LIB;
  return YAKU_LIB.filter((yaku) => !restrictedSet.has(yaku.name));
}
</script>

<template>
  <div class="relative w-full flex flex-col items-center overflow-y-scroll overflow-x-hidden">
    <div v-for="(yaku, index) in allowedYaku()" :key="index" class="yaku-progress">
      <h1 :class="`yaku-name ${isComplete(yaku.name)} text-yellow-100`">{{ yaku.name }}</h1>
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
      <div v-if="yaku.description" class="yaku-description">
        <p v-for="line in yaku.description" :key="line">
          {{ line }}
        </p>
        <p
          v-if="viewingsLimited && restrictedSet.has(yaku.name)"
          class="mt-1 text-xs max-w-prose whitespace-nowrap font-mono"
        >
          <Icon name="mdi:info-outline" class="pointer-events-none mr-1" />
          Requires at least one other completed yaku<br /><span class="pl-4"
            >( not
            {{ [...restrictedSet].filter((name) => name != yaku.name)[0].toUpperCase() }}
            )</span
          >
        </p>
      </div>
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
    </div>
    <div id="legend" class="fixed top-28 right-4 flex flex-col gap-2 items-center">
      <p>uncollectible</p><Card name="kiri-no-kasu-1" class="opacity-30 unavailable" />
      <p>collectible</p><Card name="kiri-no-kasu-1" class="opacity-30" />
      <p>collected</p><Card name="kiri-no-kasu-1" />
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
    "cards cards";
}

@media (orientation: landscape) {
  :has(> .yaku-progress) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
}

#legend {
  & .card {
    --card-width: 30px;
  }

  & p {
    font-size: x-small;
    font-family: Consolas;
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
