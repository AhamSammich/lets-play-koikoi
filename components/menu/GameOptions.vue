<script setup lang="ts">
import { useDesignStore } from "~~/stores/designStore";
import { useGameStore } from "~~/stores/gameStore";

const designStore = useDesignStore();

const gameStore = useGameStore();
const started = toRef(gameStore, "gameInProgress");

const settings: Record<string, Ref> = {
  maxRounds: <Ref<number>>RULES.useMaxRounds(),
  viewingsAllowed: <Ref<number>>RULES.useViewingsAllowed(),
  bonusForAnyKoiKoi: <Ref<boolean>>RULES.useBonusForAnyKoiKoi(),
  doubledOverSeven: <Ref<boolean>>RULES.useDoubledOverSeven(),
};

const INPUTS: Map<string, any[]> = new Map();
const activeDesign = computed(() => designStore.getActiveDesign);

function updateDesign(target: any) {
  if (!(target instanceof HTMLSelectElement)) return;
  let designName = target.value;
  designStore.setActiveDesign(designName);
}

async function loadDesign() {
  // Load design preference from local storage.
  if (!localStorage) return;
  let savedDesign = localStorage.getItem("cardDesign");
  let designSelectElement = document.getElementById("card-design");
  // Use a default design if none saved.
  designStore.setActiveDesign(savedDesign);
  if (designSelectElement instanceof HTMLSelectElement)
    designSelectElement.value = activeDesign.value.title;
}

function updateRuleSet(target: any) {
  if (target === null) return;
  const input: HTMLInputElement = target;
  let key = input.getAttribute("name");
  if (!key) return;
  switch (input.type) {
    case "radio":
      settings[key].value = Number(input.getAttribute("value"));
      break;
    case "checkbox":
      settings[key].value = input.checked;
      break;
    default:
      settings[key].value = input.value;
  }
}

async function loadRuleSet() {
  // Load saved options from localStorage
  if (!localStorage) return;
  try {
    Object.keys(settings).forEach((rule) => {
      INPUTS.set(rule, [...document.querySelectorAll(`[name=${rule}]`)]);
      if (!localStorage.getItem(rule)) return;
      INPUTS.get(rule)?.forEach((input) => {
        switch (input.type) {
          case "radio":
          case "checkbox":
            if (localStorage.getItem(rule) === input.value) {
              input.checked = true;
              updateRuleSet(input);
            } else {
              input.checked = false;
            }
            break;
          default:
            input.value = localStorage.getItem(rule);
            updateRuleSet(input);
        }
      });
    });
  } catch (err) {
    console.warn("Failed to apply saved options.");
  }
}

onMounted(async () => {
  await loadRuleSet();
  await loadDesign();
  watchEffect(() => {
    // Options may only be changed from the title screen
    INPUTS.forEach((inputArr) =>
      inputArr
        .filter((input) => input.name != "cardStyle") // Allow style change mid-game
        .forEach((input) => (input.disabled = started.value))
    );
  });

  // Update localStorage for changing options
  if (!localStorage) return;
  Object.keys(settings).forEach((key) => {
    watchEffect(() => {
      console.log(`Updated ${key} -> ${settings[key].value}`);
      localStorage.setItem(key, settings[key].value);
    });
  });

  watchEffect(() => {
    console.log(`Updated cardDesign -> ${activeDesign.value.name}`);
    localStorage.setItem("cardDesign", activeDesign.value.name);
  });
});
</script>

<template>
  <section>
    <!-- choose number of rounds: 3 / 6 / 12 -->
    <fieldset>
      <legend>
        Game Length
        <span>({{ settings.maxRounds }} rounds)</span>
      </legend>
      <div>
        <label for="length-season">Season</label>
        <input
          type="radio"
          id="length-season"
          name="maxRounds"
          value="3"
          @change="(e) => updateRuleSet(e.target)"
        />
      </div>
      <div>
        <label for="length-half">Half</label>
        <input
          type="radio"
          id="length-half"
          name="maxRounds"
          value="6"
          @change="(e) => updateRuleSet(e.target)"
        />
      </div>
      <div>
        <label for="length-year">Year</label>
        <input
          type="radio"
          id="length-year"
          name="maxRounds"
          value="12"
          @change="(e) => updateRuleSet(e.target)"
          checked
        />
      </div>
    </fieldset>
    <!-- allow hanami-zake/tsukimi-zake: always / limited / never -->
    <fieldset>
      <legend>
        Allow "Flower/Moon Viewing"<a
          href="https://fudawiki.org/en/hanafuda/games/koi-koi#taming-the-sake-cup"
          target="_blank"
          ><Icon name="material-symbols:help-outline-rounded"
        /></a>
      </legend>
      <div>
        <label for="viewings-never">Never</label>
        <input
          type="radio"
          id="viewings-never"
          name="viewingsAllowed"
          value="0"
          @change="(e) => updateRuleSet(e.target)"
        />
      </div>
      <div>
        <label for="viewings-limited">Limited</label>
        <input
          type="radio"
          id="viewings-limited"
          name="viewingsAllowed"
          value="1"
          @change="(e) => updateRuleSet(e.target)"
        />
      </div>
      <div>
        <label for="viewings-always">Always</label>
        <input
          type="radio"
          id="viewings-always"
          name="viewingsAllowed"
          value="2"
          @change="(e) => updateRuleSet(e.target)"
          checked
        />
      </div>
    </fieldset>
    <!-- select additional scoring rules: x2 any koi-koi / x2 if >7pts -->
    <fieldset>
      <legend>
        Additional Scoring Rules<a
          href="https://fudawiki.org/en/hanafuda/games/koi-koi#scoring-variations"
          target="_blank"
          ><Icon name="material-symbols:help-outline-rounded"
        /></a>
      </legend>
      <div>
        <input
          type="checkbox"
          id="scoring-double-any"
          name="bonusForAnyKoiKoi"
          value="true"
          @change="(e) => updateRuleSet(e.target)"
        />
        <label for="scoring-double-any">x2 for koi-koi by any player</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="scoring-double-seven"
          name="doubledOverSeven"
          value="true"
          @change="(e) => updateRuleSet(e.target)"
        />
        <label for="scoring-double-seven">x2 for yaku more than 7 points</label>
      </div>
    </fieldset>

    <!-- choose style/design of cards -->
    <fieldset>
      <legend>Card Design</legend>
      <div class="flex flex-col gap-2">
        <label class="text-sm" for="card-design">Select a design:</label>
        <select
          id="card-design"
          title="Select a design"
          name="cardDesign"
          class="px-4 py-1 text-sm bg-transparent outline outline-yellow-200 focus-within:bg-gray-900"
          @change="(e) => updateDesign(e.target)"
        >
          <option v-for="(design, key) in designStore.getDesigns" :key="key" :value="key">
            {{ design.title }}
          </option>
        </select>
        <div id="attribution" class="text-sm">
          <p class="mb-1">{{ activeDesign.attribution }}</p>
          <a class="text-yellow-200" :href="activeDesign.url" target="_blank"
            >{{ activeDesign.urlDescription }}<Icon name="mi:external-link"
          /></a>
        </div>
      </div>
    </fieldset>
  </section>
</template>

<style scoped lang="postcss">
section {
  display: grid;
  gap: 0.75rem;
}

fieldset {
  --input-size: 1rem;
  --input-color: var(--menu-accent2);
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1em 2em;
  padding-top: 2em;
  width: clamp(350px, max-content, 420px);
  max-height: 100%;

  &:has([type="checkbox"]) {
    flex-direction: column;
    gap: 0.75em;

    & > div {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      gap: 0.5em;
    }
  }

  & div:has(input) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;

    & label {
      font-size: small;
      margin-bottom: 0.5em;
      cursor: pointer;
    }

    &:hover {
      color: var(--input-color);
    }

    &:has([type="checkbox"]) {
      flex-direction: row;
      & label {
        margin-bottom: 0;
      }
    }
  }

  & legend {
    position: absolute;
    top: 0;
    left: 0;
    font-size: smaller;
    font-weight: bold;
    white-space: nowrap;
  }

  & :has([disabled]) {
    opacity: 0.5;

    &:has(label, input):hover,
    & :is(label, input) {
      cursor: not-allowed;
    }
  }
}

@media (orientation: landscape) {
  fieldset {
    width: clamp(300px, 45%, 400px);
  }

  section {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 100%;
  }
}

[type="radio"],
[type="checkbox"] {
  appearance: none;
  outline: 1px solid var(--input-color);
  width: var(--input-size);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: scale 0.5s;

  &::after {
    content: "";
    display: block;
    position: absolute;
    aspect-ratio: 1 / 1;
    width: var(--input-size);
    background: url(images/webp/sakura.webp), url(images/png/sakura.png);
    background-size: contain;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    scale: 0;
    transform-origin: center;
    transition: scale 0.5s;
  }

  &:is(input[type="checkbox"]) {
    border-radius: 0.2rem;

    &::after {
      background: url(images/webp/coin.webp), url(images/png/coin.png);
      background-size: contain;
    }
  }

  &:checked {
    scale: 0.5;
  }

  &:checked::after {
    scale: 2.5;
  }
}

select {
  cursor: pointer;
  border-radius: 0.2rem;
}

.icon {
  font-size: 1.2em;
  margin-left: 0.5em;
  margin-bottom: 0.2em;
}

a:hover {
  color: var(--menu-accent1);
}
</style>
