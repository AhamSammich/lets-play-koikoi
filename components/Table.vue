<script setup lang="ts">
import { STORE } from "~~/components/composables/game";
import { Ref } from "vue";
import {
  checkForWinOrVoid,
  getCardsInYaku,
  matchCardInArr,
} from "~~/assets/scripts/match";

const emits = defineEmits(["match-select", "deck-draw", "next-round"]);

const P1: Player = {
  hand: STORE.useHand1(),
  collection: STORE.useCollection1(),
  yaku: STORE.useYaku1(),
  score: STORE.useScore1(),
};

const P2: Player = {
  hand: STORE.useHand2(),
  collection: STORE.useCollection2(),
  yaku: STORE.useYaku2(),
  score: STORE.useScore2(),
};

const player: Record<string, () => Player> = {
  p1: () => P1,
  p2: () => P2,
};

const draw: Ref<boolean | null> = ref(false);
const newYaku: Ref<MultiDict> = ref({});
const winningYaku: Ref<Dict | null> = ref({});
const winner: Ref<string | null> = ref("");

const scoreboard: Record<string, Ref<number>> = {
  p1: <Ref<number>>STORE.useScore1(),
  p2: <Ref<number>>STORE.useScore2(),
};

const TABLE = {
  hand: STORE.useField(),
  selectedCard: ref(""),
  matchesFound: ref(<string[]>[]),
  cardsToCollect: <Set<string>>new Set(),
};

const activeP = STORE.useActiveP();
const activeHand = () => player[activeP.value]().hand;
let WAIT = false;
let calledKoiKoi = "";

async function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resetRefs() {
  Object.values(player).forEach((p) => {
    p().hand.value = [];
    p().collection.value = [];
    p().yaku.value = {};
  });
  [newYaku, winningYaku].forEach((refVar) => (refVar.value = {}));
  winner.value = "";
  return;
}

async function newGame(score?: number) {
  if (score && winner.value) scoreboard[winner.value].value += score;
  if (winner.value) activeP.value = winner.value;
  emits("next-round");
  await resetRefs();
  TABLE.selectedCard.value = "";
  calledKoiKoi = "";
  WAIT = false;
  draw.value = null; // Triggers deck reshuffle
  return;
}

async function checkForInstantYaku(checkHand: Ref<string[]>): Promise<void> {
  if (WAIT) return;
  let yaku = checkForWinOrVoid(checkHand.value);
  if (yaku === null) return;
  if (yaku && checkHand === TABLE.hand) {
    newGame();
    return;
  }
  if (yaku) {
    if (winningYaku.value) winningYaku.value[yaku] = checkHand.value;
    winner.value = activeP.value;
    return;
  }
}

function dealFirstHands(cards: string[]): void {
  P1.hand.value = cards.slice(0, 8);
  P2.hand.value = cards.slice(8, 16);
  TABLE.hand.value = cards.slice(16);
  [P1.hand, P2.hand, TABLE.hand].forEach(checkForInstantYaku);
  draw.value = false;
  main();
  if (activeP.value === "p2") aiFindMatch();
}

async function setActiveP(): Promise<string> {
  return activeP.value === "p1" ? "p2" : "p1";
}

async function setSelectedCard(cardName: string): Promise<void> {
  TABLE.selectedCard.value = cardName;
  // await sleep(500);
  return;
}

async function revealCard(cardName: string) {
  await setSelectedCard(cardName);
  console.log(`Revealed ${TABLE.selectedCard.value} from the deck.`);
  await sleep(300);
}

async function collectCards(cardSet: Set<string>, toCollection: string[]): Promise<string[]> {
  try {
    return toCollection.concat([...cardSet]);
  } catch (err) {
    console.error(err);
    return toCollection;
  }
}

async function checkForDraw() {
  if (Object.keys(newYaku.value)) return;
  TABLE.selectedCard.value = "";
  draw.value = !draw.value;
  if (draw.value === true) return;

  let collected = await collectCards(TABLE.cardsToCollect, activeP.value);
  if (collected) TABLE.cardsToCollect.clear();

  if (activeHand().value.length === 0) {
    winningYaku.value = null;
    winner.value = null;
    return;
  }
  activeP.value = activeP.value === "p1" ? "p2" : "p1";
  console.log(`It's Player${activeHand() === P1.hand ? "1" : "2"}'s turn...`);
  if (activeP.value === "p2") aiFindMatch();
}

function aiFindMatch() {
  let aiCard = "";
  let matchedCards: string[] = [];
  for (let card of P2.hand.value) {
    aiCard = card;
    matchedCards = matchCardInArr(card, TABLE.hand.value);
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
  return;
}

async function getMatch(cardName: string): Promise<string[]> {
  let matches = matchCardInArr(cardName, TABLE.hand.value);
  return matches;
}

function noMatch(cardName: string) {
  // Remove selected card from hand and add to field
  let thrownCard = draw.value
    ? cardName
    : activeHand().value.splice(activeHand().value.indexOf(cardName), 1)[0];
  TABLE.hand.value.push(thrownCard);
  console.log(`${thrownCard} placed on the field.`);
  checkForDraw();
}

function showMatch(cards: string[]): void {
  if (cards.length === 1) {
    handleMatch(cards);
    return;
  }
  TABLE.matchesFound.value.push(...cards);
}

async function handleMatch(cards: string[]) {
  // Clear matches and hide modal
  cards.forEach(card => TABLE.cardsToCollect.add(card));
  await sleep(500);
  TABLE.matchesFound.value.splice(0);
  return;
}

async function removeFromHand(
  cardsToRemove: string | Set<string>,
  fromArr: string[]
): Promise<string[]> {
  // Take set of card names as argument
  // Return new array of card names
  try {
    return fromArr.filter((card) =>
      typeof cardsToRemove === "string"
        ? card !== cardsToRemove
        : cardsToRemove.has(card) === false
    );
  } catch (err) {
    console.error(err);
    return fromArr;
  }
}

async function showYaku(yakuNames: string[], p: string) {
  WAIT = true;
  const P = player[activeP.value]();
  let [yakuList, coll] = [P.yaku.value, P.collection.value];
  let newList: Record<string, string[]> = {};
  yakuNames.forEach((yakuName) => {
    // Save yaku for later scoring
    newList[yakuName] = getCardsInYaku(yakuName, coll);
  });
  for (let yakuName in newList) yakuList[yakuName] = newList[yakuName];
  newYaku.value = { player: activeP.value, newList };
  return;
}

async function continueGame(bool: boolean, p: string) {
  if (p === "p2") {
    let chance = Math.floor(Math.random() * 100);
    let factor = P2.hand.value.length * 10;
    bool = chance < factor;
  }
  newYaku.value = {};
  if (!bool) {
    let yakuList = player[p]().yaku.value;
    winningYaku.value = yakuList;
    winner.value = p;
    return;
  }
  calledKoiKoi = p;
  WAIT = false;
  checkForDraw();
}

async function main() {
  let running = true;
  let reset = false;

  console.log("Running game...");
  while (running) {
    if (reset) {
      running = false;
    }

    while (true) {
      if (TABLE.selectedCard.value || activeP.value === "p2") {
                        console.log(`${activeP.value} played ${TABLE.selectedCard.value}.`);
        break;
      }
      await sleep();
    }

    let matches = await getMatch(TABLE.selectedCard.value);
    await sleep();
    if (matches.length) {
      if (matches.length == 1 || matches.length == 3) {
        // Collect matches and selected
        [TABLE.selectedCard.value, ...matches].forEach((card) =>
        TABLE.cardsToCollect.add(card)
        );
                        console.log(`${activeP.value} matched ${[...TABLE.cardsToCollect]}.`);
        TABLE.hand.value = await removeFromHand(new Set(matches), TABLE.hand.value);
      } else {
        if (activeP.value === "p2") {
          // Select the first of 2 matches
          handleMatch(matches.slice(0, 1));
        } else {
          TABLE.matchesFound.value = matches;
        }
      }
    } else {
      // NO MATCHES; place on table
                        console.log(`${activeP.value} placed ${TABLE.selectedCard} on the table.`);
      TABLE.hand.value = TABLE.hand.value.concat([TABLE.selectedCard.value]);
    }
    activeHand().value = await removeFromHand(
      TABLE.selectedCard.value,
      activeHand().value
    );

    await sleep();
    if (TABLE.matchesFound.value.length) {
      console.log(...TABLE.matchesFound.value);
      while (TABLE.matchesFound.value.length) {
        await sleep();
      }
      await sleep();
    }

    draw.value = !draw.value;
                    console.log(draw.value ? "Drawing card..." : "Next player...");
    if (!draw.value) {
      console.log("Collecting...")
      player[activeP.value]().collection.value = await collectCards(TABLE.cardsToCollect, player[activeP.value]().collection.value);
      TABLE.cardsToCollect.clear();
      activeP.value = await setActiveP();
      console.log(`IT'S PLAYER ${activeP.value === "p1" ? 1 : 2}'S TURN`);
      await setSelectedCard("");
    }

    await sleep();
    console.log("running...");
  }
}
</script>

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// TEMPLATE //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

<template>
  <div id="tabletop">
    <!-- TOP ROW -->
    <div id="p2-hand">
      <Hand
        player="p2"
        :cards="P2.hand.value"
        @check-match="(cardName: string) => getMatch(cardName)"
      />
    </div>
    <template v-if="activeP === 'p2' && TABLE.selectedCard.value && !draw">
      <div id="p2-reveal">
        <Card :name="TABLE.selectedCard.value" />
      </div>
    </template>
    <div id="p2-collection" class="collection">
      <Collection
        player="p2"
        :cards="P2.collection.value"
        @new-yaku="async (yakuArr, player) => await showYaku(yakuArr, player)"
      />
    </div>

    <!-- CENTER ROW -->
    <div id="deck">
      <Deck
        :draw-card="draw"
        @draw="(cardName: string) => revealCard(cardName)"
        @deal="(cards: string[]) => dealFirstHands(cards)"
      />
      <template v-if="TABLE.selectedCard.value && draw">
        <div id="reveal">
          <Card :name="TABLE.selectedCard.value" />
        </div>
      </template>
    </div>
    <div id="field">
      <Field :cards="TABLE.hand.value" />
    </div>

    <!-- BOTTOM ROW -->
    <div id="p1-hand" :class="{ inactive: activeP != 'p1' }">
      <Hand
        player="p1"
        :cards="P1.hand.value"
        @check-match="(cardName: string) => setSelectedCard(cardName)"
      />
    </div>
    <div id="p1-collection" class="collection">
      <Collection
        player="p1"
        :cards="P1.collection.value"
        @new-yaku="async (yakuArr, player) => await showYaku(yakuArr, player)"
      />
    </div>

    <!-- MODAL -->
    <template v-if="TABLE.matchesFound.value.length">
      <div id="match">
        <MatchSelect
          :match-src="TABLE.selectedCard.value"
          :cards="TABLE.matchesFound.value"
          :show-modal="TABLE.matchesFound.value.length > 0"
          @match-select="async (cardArr: string[]) => await handleMatch(cardArr)"
        />
      </div>
    </template>

    <template v-if="Object.keys(newYaku).length">
      <div id="yaku-modal">
        <NewYaku
          :show-modal="!!Object.keys(newYaku).length"
          :player="<string>newYaku.player"
          :yakuList="<Dict>newYaku.newList"
          :koikoi-allowed="!!(activeHand().value.length || draw)"
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

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// STYLE //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

<style lang="postcss">
#tabletop {
  width: 100%;
  min-height: 420px;
  height: 100%;
  max-height: 800px;
  background-color: var(--tbl-green);
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-template-rows: minmax(75px, 200px) minmax(200px, 1fr) minmax(75px, 200px);
  grid-template-areas:
    "p2 p2"
    "deck field"
    "p1 p1";

  & > * {
    display: flex;
    align-items: center;
  }

  @media (orientation: landscape) {
    grid-template-rows: minmax(75px, 125px) minmax(200px, 1fr) minmax(75px, 125px);
  }
}

#deck {
  grid-area: deck;
  transform-origin: left;
}

#reveal {
  position: absolute;
  left: 5px;
  top: 5px;
  width: max-content;
  pointer-events: none;
  animation: pickUp 0.5s 1s;
}

#p1-hand {
  grid-area: p1;
  position: relative;

  &.inactive {
    pointer-events: none;
  }
}

#p2-hand {
  grid-area: p2;
  pointer-events: none;
  position: relative;

  & > * {
    position: absolute;
    right: 0;
  }
}

#p2-reveal {
  position: absolute;
  top: 25%;
  right: 25%;
  animation: pickUp 1s 1s;
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
  min-width: 350px;
  justify-self: flex-start;
  transform-origin: left;
  margin-left: 0.3rem;
}

@media (width < 500px) or (height < 500px) {
  #deck,
  #field {
    scale: 0.8;
  }
}

.collection {
  position: absolute;
  margin: 1rem 0.5rem;
  pointer-events: none;
  transform: scale(0.65);

  &#p1-collection {
    right: 0;
    bottom: 0;
    transform-origin: bottom right;
  }

  &#p2-collection {
    left: 0;
    top: 0;
    transform-origin: top left;
  }
}

dialog {
  background: hsl(0 0% 13% / 0.9);
  width: 100vw;
  height: 100vh;
  height: 100dvh;
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
  font-size: large;
  z-index: 10;
  transition: all 0.5s;

  & .btn-bar {
    width: 360px;
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

      &:hover,
      &:focus {
        transform: translate3d(0, 5%, 0);
        box-shadow: 0 0.1rem 0.3rem 0 palegoldenrod;
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
  scale: 1 0;
}
</style>
