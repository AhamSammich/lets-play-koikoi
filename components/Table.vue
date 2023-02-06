<script setup lang="ts">
import { Ref } from "vue";
import {
  checkForWinOrVoid,
  getCardsInYaku,
  matchCardInArr,
  removeSetFromArr,
} from "~~/assets/scripts/match";

const emits = defineEmits(["match-select", "deck-draw"]);

const hand1: Ref<string[]> = ref([]);
const hand2: Ref<string[]> = ref([]);
const field: Ref<string[]> = ref([]);
const match: Ref<string[]> = ref([]);
const draw: Ref<boolean | null> = ref(false);

const collection1: Ref<string[]> = ref([]);
const collection2: Ref<string[]> = ref([]);
const yaku1: Ref<Dict> = ref({});
const yaku2: Ref<Dict> = ref({});
const newYaku: Ref<MultiDict> = ref({});

const winningYaku: Ref<Dict | null> = ref({});
const winner: Ref<string | null> = ref("");

const scoreboard: Record<string, number> = { p1: 0, p2: 0 };
const selectedCard = ref("");
let activeHand = hand1;
let WAIT = false;
let calledKoiKoi = "";

async function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resetRefs() {
  [hand1, hand2, field, match, collection1, collection2].forEach(
    (refVar) => (refVar.value = [])
  );
  [yaku1, yaku2, newYaku, winningYaku].forEach((refVar) => (refVar.value = {}));
  winner.value = "";
}

async function newGame(score?: number) {
  if (score && winner.value) scoreboard[winner.value] += score;
  activeHand = !winner.value || winner.value === "p1" ? hand1 : hand2;
  await resetRefs();
  selectedCard.value = "";
  calledKoiKoi = "";
  WAIT = false;
  draw.value = null; // Triggers deck reshuffle
}

async function checkForInstantYaku(hand: Ref<string[]>): Promise<void> {
  if (WAIT) return;
  let yaku = checkForWinOrVoid(hand.value);
  if (yaku === null) return;
  if (yaku && hand === field) {
    newGame();
    return;
  }
  if (yaku) {
    if (winningYaku.value) winningYaku.value[yaku] = hand.value;
    winner.value = hand === hand1 ? "p1" : "p2";
    return;
  }
}

function dealFirstHands(cards: string[]): void {
  hand1.value = cards.slice(0, 8);
  hand2.value = cards.slice(8, 16);
  field.value = cards.slice(16);
  [hand1, hand2, field].forEach(checkForInstantYaku);
  draw.value = false;
  console.log(scoreboard);
  if (activeHand === hand2) aiFindMatch();
}

async function setSelectedCard(cardName: string): Promise<void> {
  selectedCard.value = cardName;
  await sleep(300);
}

async function revealCard(cardName: string) {
  selectedCard.value = cardName;
  console.log(`Revealed ${selectedCard.value} from the deck.`);
  await sleep(300);
  getMatch(cardName);
}

function checkForDraw() {
  if (WAIT) return;
  selectedCard.value = "";
  draw.value = !draw.value;
  if (draw.value === true) return;
  if (activeHand.value.length === 0) {
    winningYaku.value = null;
    winner.value = null;
    return;
  }
  activeHand = activeHand === hand1 ? hand2 : hand1;
  console.log(`It's Player${activeHand === hand1 ? "1" : "2"}'s turn...`);
  if (activeHand === hand2) aiFindMatch();
}

function aiFindMatch() {
  let aiCard = "";
  let matchedCards: string[] = [];
  for (let card of hand2.value) {
    aiCard = card;
    matchedCards = matchCardInArr(card, field.value);
    if (matchedCards.length) {
      console.log(`%cPlayer 2 matched ${aiCard} with ${matchedCards}`, "color: yellow;");
      break;
    }
  }
  aiSelectMatch(aiCard, matchedCards);
}

async function aiSelectMatch(cardName: string, matchedCards: string[]) {
  if (matchedCards.length === 0) {
    noMatch(cardName);
    return;
  }
  await setSelectedCard(cardName);
  if (matchedCards.length === 3) {
    // Collect all 3 matched cards from the field
    handleMatch(matchedCards);
    return;
  }
  // Select the first of 2 matches
  handleMatch(matchedCards.slice(0, 1));
}

async function getMatch(cardName: string): Promise<void> {
  await setSelectedCard(cardName);
  let matches = matchCardInArr(cardName, field.value);
  if (matches.length === 0) {
    noMatch(cardName);
    return;
  }
  console.log(`Matched ${selectedCard.value} with: ${matches.join(", ")}.`);
  // All 3 cards of the same suit are on the field
  if (matches.length === 3) {
    // Add all cards to collection
    handleMatch(matches);
    return;
  }
  // AI player has 2 possible matches from the deck draw
  if (draw.value && activeHand === hand2) {
    // Select the first match
    handleMatch(matches.slice(0, 1));
    return;
  }
  // Open modal to allow player to choose between 2 matches
  showMatch(matches);
}

function noMatch(cardName: string) {
  // Remove selected card from hand and add to field
  let thrownCard = draw.value
    ? cardName
    : activeHand.value.splice(activeHand.value.indexOf(cardName), 1)[0];
  field.value.push(thrownCard);
  console.log(`${thrownCard} placed on the field.`);
  checkForDraw();
}

function showMatch(cards: string[]): void {
  if (cards.length === 1) {
    handleMatch(cards);
    return;
  }
  match.value.push(...cards);
}

async function handleMatch(cards: string[]) {
  // Clear matches and hide modal
  match.value.splice(0);
  let hand = draw.value ? field : activeHand;
  let matchedCards = new Set([selectedCard.value, ...cards]);
  // let matchedCards = new Set([...cards]);

  [field.value, hand.value] = await Promise.all<Promise<string[]>[]>([
    // Remove matched card from field
    new Promise((resolve) => {
      setTimeout(() => resolve(removeSetFromArr(matchedCards, field.value)), 200);
    }),
    // Remove selected card from hand
    new Promise((resolve) => {
      setTimeout(() => resolve(removeSetFromArr(matchedCards, hand.value)), 200);
    }),
  ]);

  let collected = await collectCards(
    matchedCards,
    activeHand === hand1 ? collection1 : collection2
  );
  if (collected) checkForDraw();
}

async function collectCards(
  cardSet: Set<string>,
  collection: Ref<string[]>
): Promise<boolean> {
  try {
    collection.value = [...collection.value, ...cardSet];
  } catch (err) {
    console.error(err);
    WAIT = true;
    return false;
  }
  selectedCard.value = "";
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}

async function showYaku(yakuNames: string[], player: string) {
  WAIT = true;
  let [yakuList, collection] =
    player === "p1" ? [yaku1, collection1] : [yaku2, collection2];
  let newList: Record<string, string[]> = {};
  yakuNames.forEach((yakuName) => {
    // Save yaku for later scoring
    newList[yakuName] = getCardsInYaku(yakuName, collection.value);
  });
  for (let yakuName in newList) yakuList.value[yakuName] = newList[yakuName];
  newYaku.value = { player, newList };
}

async function continueGame(bool: boolean, player: string) {
  if (player === "p2") {
    let chance = Math.floor(Math.random() * 100);
    let factor = hand2.value.length * 10;
    bool = chance < factor;
  }
  newYaku.value = {};
  if (!bool) {
    let yakuList = (player === "p1" ? yaku1 : yaku2).value;
    winningYaku.value = yakuList;
    winner.value = player;
    return;
  }
  calledKoiKoi = player;
  WAIT = false;
  checkForDraw();
}
</script>

<template>
  <div id="tabletop">
    <!-- TOP ROW -->
    <div id="p2-hand" class="flex-none justify-center items-center">
      <Hand
        :is-active="activeHand === hand2"
        player="p2"
        :cards="hand2"
        @check-match="(cardName: string) => getMatch(cardName)"
      />
    </div>
    <template v-if="activeHand === hand2 && selectedCard && !draw">
      <div id="p2-reveal">
        <Card :name="selectedCard" />
      </div>
    </template>
    <div id="p2-collection" class="collection">
      <Collection
        player="p2"
        :cards="collection2"
        @new-yaku="async (yakuArr, player) => await showYaku(yakuArr, player)"
      />
    </div>

    <!-- CENTER ROW -->
    <div id="deck" class="flex justify-center items-center">
      <Deck
        :draw-card="draw"
        :ai-draw="activeHand === hand2"
        @draw="(cardName: string) => revealCard(cardName)"
        @deal="(cards: string[]) => dealFirstHands(cards)"
      />
      <template v-if="selectedCard && draw">
        <div id="reveal">
          <Card :name="selectedCard" />
        </div>
      </template>
    </div>
    <div id="field">
      <Field :cards="field" />
    </div>

    <!-- BOTTOM ROW -->
    <div
      id="p1-hand"
      class="flex-none justify-center items-center w-full"
      :data-msg="`${activeHand === hand1 && !draw ? 'Play a card' : ''}`"
    >
      <Hand
        :is-active="activeHand === hand1 && !draw"
        player="p1"
        :cards="hand1"
        @check-match="(cardName: string) => getMatch(cardName)"
      />
    </div>
    <div id="p1-collection" class="collection">
      <Collection
        player="p1"
        :cards="collection1"
        @new-yaku="async (yakuArr, player) => await showYaku(yakuArr, player)"
      />
    </div>

    <!-- MODAL -->
    <div id="match">
      <MatchSelect
        :match-src="selectedCard"
        :cards="match"
        :show-modal="match.length > 0"
        @match-select="async (cardArr: string[]) => await handleMatch(cardArr)"
      />
    </div>

    <template v-if="Object.keys(newYaku).length">
      <div id="yaku-modal">
        <NewYaku
          :show-modal="!!Object.keys(newYaku).length"
          :player="<string>newYaku.player"
          :yakuList="<Dict>newYaku.newList"
          :koikoi-allowed="!!(activeHand.length || draw)"
          @koi-koi="async (bool, player) => await continueGame(bool, player)"
        />
      </div>
    </template>

    <template v-if="winner !== '' && (winningYaku || winningYaku === null)">
      <div id="end-screen">
        <ScoreSheet
          :player="winner"
          :yakuList="winningYaku"
          :koikoi="!!calledKoiKoi && winner != calledKoiKoi"
          :show-modal="winner !== ''"
          @reset="(score: number) => newGame(score)"
        />
      </div>
    </template>
  </div>
</template>

<style lang="postcss">
#tabletop {
  width: 100dvw;
  height: 100dvh;
  background-color: rgb(22 101 52);
  overflow: hidden;
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: minmax(75px, 200px) 1fr minmax(75px, 200px);
  grid-template-areas:
    "p2 p2"
    "deck field"
    "p1 p1";

  & > * {
    display: flex;
    align-items: center;
  }
}

#deck {
  grid-area: deck;
}

#reveal {
  position: absolute;
  top: 40%;
  left: 25px;
  pointer-events: none;
  animation: pickUp 0.5s 1s;
}

#p1-hand {
  grid-area: p1;
  /* margin-left: 1rem; */
  position: relative;

  &::before {
    content: attr(data-msg);
    display: block;
    position: absolute;
    bottom: 75%;
    right: 50%;
    color: #eee;
    font-weight: bold;
  }
}

#p2-hand {
  grid-area: p2;
  /* margin-right: 1rem; */
  transform: translate3d(5%, -30%, 0) rotate(180deg);
  pointer-events: none;
}

#p2-reveal {
  position: absolute;
  top: 20%;
  right: 20%;
  animation: pickUp 0.5s 1s;
}

@keyframes pickUp {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale(1.2) translate3d(20%, 0, 0);
  }
}

#field {
  grid-area: field;
  min-width: 320px;
  justify-self: flex-start;
  margin-left: 25px;
  transform-origin: left;
  @media (width < 500px) or (height < 400px) {
    transform: scale(0.75);
  }
}

.collection {
  position: absolute;
  margin: 1rem 0.5rem;
  pointer-events: none;

  &#p1-collection {
    right: 0;
    bottom: 0;
  }

  &#p2-collection {
    left: 0;
    top: 0;
  }

  @media (orientation: portrait) {

    &#p1-collection {
      right: 0;
      bottom: 20%;
    }

    &#p2-collection {
      left: 0;
      top: 10%;
    }
  }
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
  gap: 0.5rem;
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: white;
  font-size: x-large;

  & .btn-bar {
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

  & h1,
  & h2 {
    font-weight: bold;
    font-size: larger;
    text-transform: uppercase;
  }

  & h2 {
    font-size: inherit;
  }
}

.hidden {
  display: none;
}
</style>
