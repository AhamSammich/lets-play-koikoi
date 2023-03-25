<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { useGameStore } from "~~/stores/gameStore";
import { usePlayerStore } from "~~/stores/playerStore";
import { useTableStore } from "~~/stores/tableStore";

const emits = defineEmits([
  "match-select",
  "deck-draw",
  "next-round",
  "reset",
  "called-koikoi",
]);

onMounted(() => {
  newGame();
});

onUnmounted(() => {
  emits("reset");
});

// ============================================================== //
// =====================  REACTIVE VARS  ======================== //
// ============================================================== //

const gameStore = useGameStore();
const gameIsRunning = computed(() => gameStore.gameInProgress);
const bonusForAnyKoiKoi = RULES.useBonusForAnyKoiKoi();

const playerStore = usePlayerStore();
// const p2Collection = computed(() => playerStore.p2.collectedCards);
// const p1Collection = computed(() => playerStore.p1.collectedCards);

const tableStore = useTableStore();
const { cardSelected, matchSelected } = storeToRefs(tableStore);

const P1: Player = {
  collection: STORE.useCollection1(),
  yaku: STORE.useYaku1(),
  score: STORE.useScore1(),
  koikoi: 0,
};

const P2: Player = {
  collection: STORE.useCollection2(),
  yaku: STORE.useYaku2(),
  score: STORE.useScore2(),
  koikoi: 0,
};

const PLAYER: Record<string, () => Player> = {
  p1: () => P1,
  p2: () => P2,
};

const draw: Ref<boolean | null> = ref(false);
const newYaku: Ref<MultiDict> = ref({});
const winningYaku: Ref<Dict | null> = ref({});
const winner: Ref<string | null> = ref("");

const roundNum = STORE.useRoundNum();
const isFirstRound = () => roundNum.value === 1;
const scoreboard: Record<string, Ref<number>> = {
  p1: <Ref<number>>STORE.useScore1(),
  p2: <Ref<number>>STORE.useScore2(),
};

const activeP = STORE.useActiveP();
const currentOya = STORE.useCurrentOya();
const otherP = () => (activeP.value === "p1" ? "p2" : "p1");
const otherPlayer = () => PLAYER[otherP()]();
const activePlayer = () => PLAYER[activeP.value]();

// ============================================================== //
// =======================  UTILITIES =========================== //
// ============================================================== //

const WAIT = computed({
  get() {
    return gameStore.waitingForInput;
  },
  set(newValue: boolean) {
    gameStore.waitingForInput = newValue;
  },
});
const SHOUT = ref("");
const callKoiKoi = () => {
  shoutMsg("KOI KOI");
  activePlayer().koikoi++;
  console.log(
    `${activeP.value.toUpperCase()} called Koi-Koi (x${activePlayer().koikoi})`
  );
};

async function shoutMsg(msg: string) {
  SHOUT.value = msg;
  await sleep(2000);
  SHOUT.value = "";
}

async function getActiveP(setPlayer?: string): Promise<string> {
  // Set ref value (number) and return player name (string)
  activeP.value = setPlayer || otherP();
  return activeP.value;
}

async function getCurrentOya(setOya?: number): Promise<string> {
  // Set ref value (number) and return oya name (string)
  if (!(setOya || winner.value)) return `p${currentOya.value}`;
  let playerNum = Number(winner.value?.[1]) || 0;
  currentOya.value = setOya || playerNum;
  return `p${currentOya.value}`;
}

// ============================================================== //
// ======================  START GAME  ========================== //
// ============================================================== //

async function resetRefs() {
  console.log("Resetting...");
  playerStore.clearCollections();
  Object.values(PLAYER).forEach((p) => {
    p().collection.value = [];
    p().yaku.value = {};
    p().koikoi = 0;
  });
  [newYaku, winningYaku].forEach((refVar) => (refVar.value = {}));
  winner.value = "";
  return;
}

async function newGame(score?: number) {
  if (score && winner.value) scoreboard[winner.value].value += score;
  if (winner.value) activeP.value = winner.value;
  let roundResults = { winner: winner.value, yaku: winningYaku.value };
  emits("next-round", roundResults);
  await resetRefs();
  tableStore.clearSelectedCards();
  WAIT.value = false;
  draw.value = null; // Triggers deck reshuffle
  await sleep();
}

function dealFirstHands(cards: string[]): void {
  playerStore.updateCardsInHand("p1", cards.slice(0, 8));
  playerStore.updateCardsInHand("p2", cards.slice(8, 16));
  tableStore.updateFieldCards(cards.slice(16));
  [playerStore.p1.cardsInHand, playerStore.p2.cardsInHand, tableStore.fieldCards].forEach(
    checkForInstantYaku
  );
  draw.value = false;
  if (isFirstRound()) {
    runGame();
  }
}

// ============================================================== //
// =======================  TRIGGERS  =========================== //
// ============================================================== //

async function revealCardFromDeck(cardName: string) {
  await pauseForUpdate();
  tableStore.setSelectedCard(cardName);
  tableStore.setPreviewCard(cardName);
  console.log(`%cRevealed ${cardSelected.value} from the deck.`, "color: palegreen;");
}

async function collectCards(
  cardSet: Set<string>,
  toCollection: string[]
): Promise<string[]> {
  try {
    [...cardSet].forEach((card) => playerStore.removeCardFromHand(activeP.value, card));
    playerStore.addCollectedCards(activeP.value, [...cardSet]);
    return toCollection.concat([...cardSet]);
  } catch (err) {
    console.error(err);
    return toCollection;
  }
}

// ============================================================== //
// =======================  MATCHING  =========================== //
// ============================================================== //

function aiSelectedCard(): string {
  let aiCard = "";
  for (let card of [...playerStore.p2.cardsInHand]) {
    aiCard = card;
    let matchedCards = matchCardInArr(card, tableStore.cardsOnField);
    if (matchedCards.length) break;
  }
  return aiCard;
}

function setAiSelection() {
  let aiCard = aiSelectedCard();
  tableStore.setSelectedCard(aiCard);
  tableStore.setPreviewCard(aiCard);
}

async function getMatch(cardName: string): Promise<string[]> {
  let matches = matchCardInArr(cardName, tableStore.cardsOnField);
  return matches;
}

// ============================================================== //
// =====================  VICTORY CHECK ========================= //
// ============================================================== //

async function checkForInstantYaku(cardSet: Set<string>): Promise<void> {
  if (WAIT.value) return;
  let yaku = checkForWinOrVoid([...cardSet]);
  if (yaku === null) return;
  if (yaku && cardSet === tableStore.fieldCards) {
    newGame();
    return;
  }
  if (yaku) {
    if (winningYaku.value) winningYaku.value[yaku] = [...cardSet];
    winner.value = activeP.value;
    return;
  }
}

async function showYaku(yakuNames: string[], p: string) {
  WAIT.value = true;
  const P = activePlayer();
  let [yakuList, coll] = [P.yaku.value, P.collection.value];
  let newList: Record<string, string[]> = {};
  yakuNames.forEach((yakuName) => {
    // Save yaku for later scoring
    newList[yakuName] = getCardsInYaku(yakuName, coll);
  });
  for (let yakuName in newList) yakuList[yakuName] = newList[yakuName];
  newYaku.value = { player: activeP.value, newList };
}

async function continueGame(bool: boolean, p: string) {
  if (p === "p2") {
    let chance = Math.floor(Math.random() * 100);
    let factor = playerStore.p2.cardsInHand.size * 10;
    bool = chance < factor;
  }
  newYaku.value = {};
  if (!bool) {
    let yakuList = PLAYER[p]().yaku.value;
    winningYaku.value = yakuList;
    winner.value = p;
    await getCurrentOya();
    return;
  }
  callKoiKoi();
  await pauseForUpdate();
  WAIT.value = false;
}

async function whileSelectingCard() {
  while (gameIsRunning.value && !cardSelected.value) {
    if (activeP.value === "p2" && !draw.value) {
      await pauseForUpdate();
      setAiSelection();
    }
    await sleep();
  }
  return cardSelected.value;
}

function promptSelection() {
  return activeP.value === "p1" && cardSelected.value && tableStore.multipleMatchesExist;
}

async function whileSelectingMatch() {
  console.log("Awaiting match selection...");
  console.dir(tableStore.matchingCards);
  let selecting = () => gameIsRunning.value && cardSelected.value && !matchSelected.value;
  while (selecting()) {
    await sleep();
  }
  return matchSelected.value;
}

async function getSelectedMatch(possibleMatches: string[]) {
  let matchesSelected: string[] = [];
  if (possibleMatches.length == 1 || possibleMatches.length == 3) {
    matchesSelected.push(...possibleMatches);
  } else if (activeP.value === "p2") {
    matchesSelected.push(possibleMatches[0]);
  } else {
    matchesSelected.push(await whileSelectingMatch());
  }
  return matchesSelected;
}

const pauseForUpdate = async () => await sleep(300);

// ============================================================== //
// =======================  MAIN LOOP  ========================== //
// ============================================================== //

async function runGame() {
  tableStore.clearSelectedCards();
  await pauseForUpdate();
  await getActiveP(await getCurrentOya());
  const cardsToCollect: Set<string> = new Set();

  while (gameIsRunning.value) {
    let cardPlayed = await whileSelectingCard();
    await pauseForUpdate();

    let matches = await getMatch(cardPlayed);
    if (matches.length) {
      let matchedCards = await getSelectedMatch(matches);
      await pauseForUpdate();
      console.log(
        `%c${activeP.value.toUpperCase()} matched ${cardPlayed} with ${matchedCards}`,
        "color: yellow;"
      );

      [cardPlayed, ...matchedCards].forEach((card) => {
        cardsToCollect.add(card);
        tableStore.removeFieldCard(card);
      });
    } else {
      await pauseForUpdate();
      console.log(`${activeP.value} placed ${cardPlayed} on the table.`);
      tableStore.addFieldCard(cardPlayed);
    }

    playerStore.removeCardFromHand(activeP.value, cardPlayed);
    await pauseForUpdate();

    tableStore.clearSelectedCards();
    await pauseForUpdate();

    draw.value = !draw.value;
    if (!draw.value) {
      console.log("Collecting...");
      // Collection will emit 'new-yaku' or 'no-yaku'
      activePlayer().collection.value = await collectCards(
        cardsToCollect,
        activePlayer().collection.value
      );
      cardsToCollect.clear();
      WAIT.value = true;

      // Wait for victory determination
      let newOya;
      while (WAIT.value) {
        if (winner.value && !newOya) {
          newOya = winner.value;
        }
        await sleep(500);
      }

      // Call a draw if player has no more cards
      if (playerStore.activeHandIsEmpty(activeP.value)) {
        WAIT.value = true;
        winningYaku.value = null;
        winner.value = null;
        while (WAIT.value) await sleep(500);
        await getActiveP(await getCurrentOya());
      } else {
        await getActiveP(newOya);
      }
      console.log(`IT'S PLAYER ${activeP.value === "p1" ? 1 : 2}'S TURN`);
    }
  }
}

onMounted(() => {
  watchEffect(() => {
    console.log(`SELECTED: ${getName(cardSelected.value.toUpperCase())}`);
  });
  watchEffect(() => {
    console.log(`MATCHED: ${getName(matchSelected.value.toUpperCase())}`);
  });
});
</script>

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// TEMPLATE //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

<template>
  <div id="tabletop" class="relative">
    <!-- TOP ROW -->
    <div id="p2-hand">
      <Hand player="p2" @check-match="(cardName: string) => getMatch(cardName)" />
    </div>
    <div v-show="activeP === 'p2' && cardSelected && !draw" id="p2-reveal">
      <StaticCard :name="cardSelected" loading="eager" />
    </div>
    <div id="p2-collection" class="collection">
      <Collection
        player="p2"
        :cards="P2.collection.value"
        @new-yaku="async (yakuArr, player) => await showYaku(yakuArr, player)"
        @collecting="() => (WAIT = true)"
        @no-yaku="() => (WAIT = false)"
      />
    </div>

    <!-- CENTER ROW -->
    <div id="deck">
      <Deck
        :draw-card="draw"
        @draw="(cardName: string) => revealCardFromDeck(cardName)"
        @deal="(cards: string[]) => dealFirstHands(cards)"
      />
      <div v-show="cardSelected && draw" id="reveal">
        <StaticCard :name="cardSelected" loading="eager" />
      </div>
    </div>
    <div id="field" class="relative">
      <div
        v-show="gameStore.showHints || isFirstRound()"
        class="help absolute bottom-full max-md:mb-4 h-max w-full font-mono text-white text-sm xl:text-lg"
      >
        <p v-if="promptSelection()">
          {{ isTouchScreen() ? "Tap" : "Click" }} to select a match...
        </p>
      </div>
      <Field />
    </div>

    <!-- BOTTOM ROW -->
    <div
      id="p1-hand"
      :class="{
        'flex flex-col relative': true,
        inactive: activeP != 'p1' || draw,
      }"
    >
      <div
        class="help xl:absolute xl:top-full xl:text-lg h-max w-full font-mono text-white text-xs ml-4 mb-2 self-start"
      >
        <!-- Click light-bulb icon to toggle hints. -->
        <Icon
          name="material-symbols:tips-and-updates"
          :class="{
            'float-left mr-2 cursor-help transition-all': true,
            'text-xl text-yellow-200': gameStore.showHints,
            'text-lg': !gameStore.showHints,
          }"
          @click="
            () => {
              if (!isFirstRound()) gameStore.toggleHelp();
            }
          "
        />
        <!-- Hide hints if it's not Player 1's turn. -->
        <div
          v-show="
            (gameStore.showHints || isFirstRound()) &&
            activeP === 'p1' &&
            !draw &&
            !cardSelected
          "
        >
          <!-- Show different control hints for mobile/touchscreen or desktop. -->
          <p v-if="tableStore.cardPreviewed">
            <span v-if="isTouchScreen()"> Tap the card again </span>
            <span v-else> Click the card </span>
            to play {{ getName(tableStore.cardPreviewed).toUpperCase() }}.
          </p>
          <p v-else>
            <span v-if="isTouchScreen()"> Tap a card </span>
            <span v-else> Hover over cards </span>
            to preview possible matches.
          </p>
        </div>
      </div>
      <Hand
        class="self-start"
        player="p1"
        @check-match="(cardName: string) => tableStore.setSelectedCard(cardName)"
      />
    </div>
    <div id="p1-collection" class="collection">
      <Collection
        player="p1"
        :cards="P1.collection.value"
        @new-yaku="async (yakuArr, player) => await showYaku(yakuArr, player)"
        @collecting="() => (WAIT = true)"
        @no-yaku="() => (WAIT = false)"
      />
    </div>

    <div v-if="Object.keys(newYaku).length" id="yaku-modal">
      <NewYaku
        :show-modal="!!Object.keys(newYaku).length"
        :player="<string>newYaku.player"
        :yakuList="<Dict>newYaku.newList"
        :koikoi-allowed="!!(!playerStore.activeHandIsEmpty(activeP) || draw)"
        @koi-koi="async (bool, player) => await continueGame(bool, player)"
      />
    </div>

    <div v-if="winner !== '' && (winningYaku || winningYaku === null)" id="end-screen">
      <ScoreSheet
        :player="winner"
        :yakuList="winningYaku"
        :koikoi="
          bonusForAnyKoiKoi
            ? otherPlayer().koikoi + activePlayer().koikoi
            : otherPlayer().koikoi
        "
        :show-modal="winner !== ''"
        @reset="(score: number) => newGame(score)"
      />
    </div>

    <Shout v-if="SHOUT" :msg="SHOUT" />
  </div>
</template>

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// STYLE //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

<style lang="postcss">
#tabletop {
  --left-shift: 6rem;
  width: 100%;
  max-width: var(--tbl-w-max);
  min-height: 420px;
  height: 100%;
  max-height: 800px;
  margin: 0 auto;
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
    grid-template-rows: 60px minmax(100px, 1fr) 150px;

    & #p1-hand {
      padding-bottom: 80px;
      padding-left: var(--left-shift);
    }

    & :is(#deck, #field) {
      translate: var(--left-shift) 0;
    }
  }
}

#deck {
  grid-area: deck;
  transform-origin: left;
  position: relative;
}

#reveal {
  position: absolute;
  left: 5px;
  top: 5px;
  width: max-content;
  pointer-events: none;
  opacity: 0;
  z-index: 5;
  transform-origin: center;
  animation: pickUp 1.5s ease-out;
}

.help {
  & p {
    animation: fadeIn 2s ease-in, dropIn 1s;
  }
}

#p1-hand {
  grid-area: p1;
  position: relative;
  z-index: 1;

  &.inactive {
    pointer-events: none;
  }

  & .card {
    cursor: pointer;
  }
}

#p2-hand {
  grid-area: p2;
  pointer-events: none;
  position: relative;
  margin-right: var(--card-width);
  rotate: 180deg;

  & > * {
    --card-width: 50px;
    position: absolute;
  }
}

#p2-reveal {
  position: absolute;
  top: 25%;
  right: 25%;
  opacity: 0;
  animation: pickUp 1.5s 0.5s;
  z-index: 5;
}

#field {
  grid-area: field;
  min-width: 350px;
  justify-self: flex-start;
  transform-origin: left;
  margin-left: 0.5rem;
}

@media (width < 500px) or (height < 500px) {
  #deck,
  #field {
    --card-width: 60px;
  }
}

.collection {
  position: absolute;
  margin: 0.5rem;
  transition: all 0.3s;
  opacity: 0.6;
  z-index: 2;

  &:hover {
    opacity: 1;
    z-index: 5;
  }

  & * {
    pointer-events: none;
  }

  &#p1-collection {
    right: 0;
    bottom: 0;
    transform-origin: center;
    transform: scaleX(-1);

    & > * {
      transform-origin: center;
      transform: scaleX(-1);
    }
  }

  &#p2-collection {
    left: 0;
    top: 0;
    transform-origin: top left;

    @media (orientation: portrait) {
      top: 3rem;
    }

    @media (orientation: landscape) {
      left: var(--left-shift);
    }
  }
}
</style>
