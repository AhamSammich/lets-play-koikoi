<script setup lang="ts">
const collection = STORE.useCollection1();
const yakuCompleted = STORE.useYaku1();
const viewingsAllowed = RULES.useViewingsAllowed();

function isComplete(yakuName: string) {
  if (yakuCompleted.value[yakuName]) return "complete";
  else return "";
}

function allowedYaku(): YakuDetails[] {
  if (viewingsAllowed.value) return YAKU_LIB;
  return YAKU_LIB.filter((yaku) => !["hanami-zake", "tsukimi-zake"].includes(yaku.name));
}
</script>

<template>
  <div class="w-full flex flex-col items-center overflow-y-scroll overflow-x-hidden">
    <div v-for="(yaku, index) in allowedYaku()" :key="index" class="yaku-progress">
      <h1 :class="`yaku-name ${isComplete(yaku.name)}`">{{ yaku.name }}</h1>
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
          :class="{ 'opacity-30': !collection.includes(card) }"
          :data-name="getName(card)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.yaku-progress {
  width: 400px;
  height: max-content;
  padding: 2rem;
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

.coin {
  height: 20px;
  width: 20px;
  top: 32px;
  right: 8rem;
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
}
.yaku-cards {
  grid-area: cards;
  max-width: 320px;
  display: flex;
  gap: 0.25rem;
  justify-content: flex-start;
  flex-wrap: wrap;

  & > * {
    max-width: 50px;
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
    }

    &[data-name]:hover::after {
      content: attr(data-name);
      background-color: var(--tbl-black);
      opacity: 1;
    }
  }
}

h1.complete {
  background: var(--gradient-gold);
  color: transparent;
  background-clip: text;
  position: relative;

  /* &::after {
    content: "";
    background: url(coin.png);
    background-size: contain;
    width: 20px;
    aspect-ratio: 1 / 1;
    display: block;
    position: absolute;
    left: 90%;
    top: 0;
    margin-left: 1rem;
  } */
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
