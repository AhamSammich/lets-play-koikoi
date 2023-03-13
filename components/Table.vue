<script setup lang="ts">
import { Ref } from "vue";
import { useGameStore } from "~~/stores/gameStore";

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

const started = STORE.useStart();
const bonusForAnyKoiKoi = RULES.useBonusForAnyKoiKoi();

const P1: Player = {
  hand: STORE.useHand1(),
  collection: STORE.useCollection1(),
  yaku: STORE.useYaku1(),
  score: STORE.useScore1(),
  koikoi: 0,
};

const P2: Player = {
  hand: STORE.useHand2(),
  collection: STORE.useCollection2(),
  yaku: STORE.useYaku2(),
  score: STORE.useScore2(),
  koikoi: 0,
};

const PLAYER: Record<string, () => Player> = {
  p1: () => P1,
  p2: () => P2,
};

const TABLE = {
  hand: STORE.useField(),
  selectedCard: ref(""),
  matchesFound: ref(<string[]>[]),
  cardsToCollect: <Set<string>>new Set(),
};

const draw: Ref<boolean | null> = ref(false);
const newYaku: Ref<MultiDict> = ref({});
const winningYaku: Ref<Dict | null> = ref({});
const winner: Ref<string | null> = ref("");

const scoreboard: Record<string, Ref<number>> = {
  p1: <Ref<number>>STORE.useScore1(),
  p2: <Ref<number>>STORE.useScore2(),
};

const activeP = STORE.useActiveP();
const currentOya = STORE.useCurrentOya();
const otherP = () => (activeP.value === "p1" ? "p2" : "p1");
const otherPlayer = () => PLAYER[otherP()]();
const activePlayer = () => PLAYER[activeP.value]();
const activeHand = () => activePlayer().hand;

// ============================================================== //
// =======================  UTILITIES =========================== //
// ============================================================== //

const WAIT = ref(false);
const SHOUT = ref("");
let START = false;
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
  Object.values(PLAYER).forEach((p) => {
    p().hand.value = [];
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
  TABLE.selectedCard.value = "";
  WAIT.value = false;
  draw.value = null; // Triggers deck reshuffle
  await sleep();
}

function dealFirstHands(cards: string[]): void {
  P1.hand.value = cards.slice(0, 8);
  P2.hand.value = cards.slice(8, 16);
  TABLE.hand.value = cards.slice(16);
  [P1.hand, P2.hand, TABLE.hand].forEach(checkForInstantYaku);
  draw.value = false;
  if (!START) {
    runGame();
    START = true;
  }
}

// ============================================================== //
// =======================  TRIGGERS  =========================== //
// ============================================================== //

async function setSelectedCard(cardName: string): Promise<void> {
  TABLE.selectedCard.value = cardName;
  await sleep(200);
}

async function revealCard(cardName: string) {
  await setSelectedCard(cardName);
  console.log(`Revealed ${TABLE.selectedCard.value} from the deck.`);
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

async function collectCards(
  cardSet: Set<string>,
  toCollection: string[]
): Promise<string[]> {
  try {
    return toCollection.concat([...cardSet]);
  } catch (err) {
    console.error(err);
    return toCollection;
  }
}

// ============================================================== //
// =======================  MATCHING  =========================== //
// ============================================================== //

function aiFindMatch(): string {
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
  return aiCard;
}

async function getMatch(cardName: string): Promise<string[]> {
  let matches = matchCardInArr(cardName, TABLE.hand.value);
  return matches;
}

async function handleMatch(cards: string[]) {
  // Clear matches and hide modal
  cards.forEach(async (card) => {
    TABLE.cardsToCollect.add(card);
    TABLE.hand.value = await removeFromHand(new Set(cards), TABLE.hand.value);
  });
  TABLE.matchesFound.value = [];
  WAIT.value = false;
}

// ============================================================== //
// =====================  VICTORY CHECK ========================= //
// ============================================================== //

async function checkForInstantYaku(checkHand: Ref<string[]>): Promise<void> {
  if (WAIT.value) return;
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
    let factor = P2.hand.value.length * 10;
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
  WAIT.value = false;
}

// ============================================================== //
// =======================  MAIN LOOP  ========================== //
// ============================================================== //

async function runGame() {
  await getActiveP(await getCurrentOya());
  let running = () => started.value;
  let waiting = () => WAIT.value;
  let reset = false;

  let selectedCard: string;
  let matches: string[];
  let aiPlay = false;
  while (running()) {
    if (reset) break;

    while (running()) {
      aiPlay = activeP.value === "p2";
      if (aiPlay && draw.value) break;
      if (aiPlay && !draw.value) {
        await setSelectedCard(aiFindMatch());
        break;
      } else if (TABLE.selectedCard.value && !aiPlay) {
        break;
      }
      await sleep();
    }

    await sleep(400);

    selectedCard = TABLE.selectedCard.value;
    matches = await getMatch(selectedCard);
    if (aiPlay && matches.length === 2) matches = matches.slice(0, 1);

    if (matches.length) {
      if (matches.length == 1 || matches.length == 3) {
        // Collect matches and selected
        [selectedCard, ...matches].forEach((card) => TABLE.cardsToCollect.add(card));
        console.log(`${activeP.value} matched ${[...TABLE.cardsToCollect]}.`);
        await sleep(400);
        TABLE.hand.value = await removeFromHand(new Set(matches), TABLE.hand.value);
        matches = [];
      } else {
        WAIT.value = true;
        TABLE.matchesFound.value = matches;
        while (waiting()) await sleep(500);
        matches = [];
      }
    } else {
      await sleep(400);
      // NO MATCHES; place on table
      console.log(`${activeP.value} placed ${selectedCard} on the table.`);
      TABLE.hand.value = TABLE.hand.value.concat([selectedCard]);
    }
    activeHand().value = await removeFromHand(selectedCard, activeHand().value);

    await sleep(400);

    if (TABLE.matchesFound.value.length) {
      console.log(...TABLE.matchesFound.value);
      while (TABLE.matchesFound.value.length) {
        await sleep(500);
      }
    }

    await setSelectedCard("");
    draw.value = !draw.value;

    if (!draw.value) {
      console.log("Collecting...");
      // Collection will emit 'new-yaku' or 'no-yaku'
      activePlayer().collection.value = await collectCards(
        TABLE.cardsToCollect,
        activePlayer().collection.value
      );
      TABLE.cardsToCollect.clear();
      WAIT.value = true;

      // Wait for victory determination
      let newOya;
      while (waiting()) {
        if (winner.value && !newOya) {
          newOya = winner.value;
        }
        await sleep(500);
      }

      // Call a draw if player has no more cards
      if (activeHand().value.length === 0) {
        WAIT.value = true;
        winningYaku.value = null;
        winner.value = null;
        while (waiting()) await sleep(500);
        await getActiveP(await getCurrentOya());
      } else {
        await getActiveP(newOya);
      }
      console.log(`IT'S PLAYER ${activeP.value === "p1" ? 1 : 2}'S TURN`);
    }
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
        @collecting="() => (WAIT = true)"
        @no-yaku="() => (WAIT = false)"
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
    <div
      id="p1-hand"
      :class="{
        'flex flex-col relative': true,
        inactive: activeP != 'p1' || draw,
      }"
    >
      <div
        id="help"
        class="xl:absolute xl:top-full xl:text-lg h-max w-full font-mono text-white text-xs ml-4 mb-2 self-start"
      >
        <!-- Click light-bulb icon to toggle hints. -->
        <Icon
          name="material-symbols:tips-and-updates"
          :class="{
            'float-left mr-2 cursor-help transition-all': true,
            'text-xl text-yellow-200': useGameStore().showHelp,
            'text-lg': !useGameStore().showHelp,
          }"
          @click="useGameStore().toggleHelp()"
        />
        <!-- Hide hints if it's not Player 1's turn. -->
        <template
          v-if="
            useGameStore().showHelp &&
            activeP === 'p1' &&
            !draw &&
            !TABLE.selectedCard.value
          "
        >
          <!-- Show different control hints for mobile/touchscreen or desktop. -->
          <p v-if="STORE.usePreview().value">
            <span v-if="isTouchScreen()"> Tap the card again </span>
            <span v-else> Click the card </span>
            to play {{ getName(STORE.usePreview().value).toUpperCase() }}.
          </p>
          <p v-else>
            <span v-if="isTouchScreen()"> Tap a card </span>
            <span v-else> Hover over cards </span>
            to preview possible matches.
          </p>
        </template>
      </div>
      <Hand
        class="self-start"
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
        @collecting="() => (WAIT = true)"
        @no-yaku="() => (WAIT = false)"
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

    <div v-if="Object.keys(newYaku).length" id="yaku-modal">
      <NewYaku
        :show-modal="!!Object.keys(newYaku).length"
        :player="<string>newYaku.player"
        :yakuList="<Dict>newYaku.newList"
        :koikoi-allowed="!!(activeHand().value.length || draw)"
        @koi-koi="async (bool, player) => await continueGame(bool, player)"
      />
    </div>

    <template v-if="winner !== '' && (winningYaku || winningYaku === null)">
      <div id="end-screen">
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
    </template>

    <template v-if="SHOUT">
      <Shout :msg="SHOUT" />
    </template>
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
  animation: pickUp 1s 0.5s;
  z-index: 1;
}

#help {
  & p {
    animation: fadeIn 2s ease-in, dropIn 1s;
  }
}

#p1-hand {
  grid-area: p1;
  position: relative;

  &.inactive {
    pointer-events: none;
  }

  & .card {
    cursor: pointer;
  }
}

#p2-hand {
  --card-width: 50px;
  grid-area: p2;
  pointer-events: none;
  position: relative;
  margin-right: var(--card-width);
  rotate: 180deg;

  & > * {
    position: absolute;
  }
}

#p2-reveal {
  position: absolute;
  top: 25%;
  right: 25%;
  opacity: 0;
  animation: pickUp 1s 0.5s;
  z-index: 1;
}

#field {
  grid-area: field;
  min-width: 350px;
  justify-self: flex-start;
  transform-origin: left;
  margin-left: 0.5rem;
  z-index: 0;
}

@media (width < 500px) or (height < 500px) {
  #deck,
  #field {
    scale: 0.8;
  }
}

.collection {
  position: absolute;
  margin: 0.5rem;
  scale: 0.6;
  transition: all 0.3s;
  opacity: 0.5;

  &:hover {
    opacity: 1;
    scale: 0.9;
    z-index: 30;
  }

  & * {
    pointer-events: none;
  }

  &#p1-collection {
    right: 0;
    bottom: 0;
    transform-origin: bottom center;
    transform: scaleX(-1);

    & .card {
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
