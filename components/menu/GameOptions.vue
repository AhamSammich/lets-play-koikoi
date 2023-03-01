<script setup lang="ts">
import { Ref } from "vue";

const started = STORE.useStart();

const rules: Record<string, Ref> = {
  maxRounds: <Ref<number>>RULES.useMaxRounds(),
  viewingsAllowed: <Ref<number>>RULES.useViewingsAllowed(),
  bonusForAnyKoiKoi: <Ref<boolean>>RULES.useBonusForAnyKoiKoi(),
  doubledOverSeven: <Ref<boolean>>RULES.useDoubledOverSeven(),
};

const INPUTS: Map<string, any[]> = new Map();

function updateRuleSet(input: HTMLInputElement) {
  let key = input.getAttribute("name");
  if (!key) return;
  switch (input.type) {
    case "radio":
      rules[key].value = Number(input.getAttribute("value"));
      break;
    case "checkbox":
      rules[key].value = input.checked;
      break;
    default:
      rules[key].value = input.value;
  }
}

async function loadRuleSet() {
  // Load saved options from localStorage
  if (!localStorage) return;
  try {
    Object.keys(rules).forEach((rule) => {
      INPUTS.set(rule, [...document.querySelectorAll(`[name=${rule}]`)]);
      if (!localStorage.getItem(rule)) return;
      INPUTS.get(rule)?.forEach((input) => {
        if (localStorage.getItem(rule) === input.value) {
          input.checked = true;
          updateRuleSet(input);
        } else input.checked = false;
      });
    });
  } catch (err) {
    console.warn("Failed to apply saved options.");
  }
}

onMounted(async () => {
  await loadRuleSet();
  watchEffect(() => {
    // Options may only be changed from the title screen
    INPUTS.forEach((inputArr) =>
      inputArr.forEach((input) => (input.disabled = started.value))
    );
  });

  // Update localStorage for changing options
  if (!localStorage) return;
  Object.keys(rules).forEach((key) => {
    watchEffect(() => {
      localStorage?.setItem(key, rules[key].value);
    });
  });
});
</script>

<template>
  <form class="grid gap-0" @submit.prevent>
    <!-- choose number of rounds: 3 / 6 / 12 -->
    <fieldset>
      <legend>
        Game Length
        <p class="inline">({{ rules.maxRounds }} rounds)</p>
      </legend>
      <div>
        <label for="length-season">Season</label>
        <input
          type="radio"
          id="length-season"
          name="maxRounds"
          value="3"
          @change="e => updateRuleSet(<HTMLInputElement>e.target)"
        />
      </div>
      <div>
        <label for="length-half">Half</label>
        <input
          type="radio"
          id="length-half"
          name="maxRounds"
          value="6"
          @change="e => updateRuleSet(<HTMLInputElement>e.target)"
        />
      </div>
      <div>
        <label for="length-year">Year</label>
        <input
          type="radio"
          id="length-year"
          name="maxRounds"
          value="12"
          @change="e => updateRuleSet(<HTMLInputElement>e.target)"
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
          @change="e => updateRuleSet(<HTMLInputElement>e.target)"
        />
      </div>
      <div>
        <label for="viewings-limited">Limited</label>
        <input
          type="radio"
          id="viewings-limited"
          name="viewingsAllowed"
          value="1"
          @change="e => updateRuleSet(<HTMLInputElement>e.target)"
        />
      </div>
      <div>
        <label for="viewings-always">Always</label>
        <input
          type="radio"
          id="viewings-always"
          name="viewingsAllowed"
          value="2"
          @change="e => updateRuleSet(<HTMLInputElement>e.target)"
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
          @change="e => updateRuleSet(<HTMLInputElement>e.target)"
        />
        <label for="scoring-double-any">x2 for any koi-koi</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="scoring-double-seven"
          name="doubledOverSeven"
          value="true"
          @change="e => updateRuleSet(<HTMLInputElement>e.target)"
        />
        <label for="scoring-double-seven">x2 for yaku >7 points</label>
      </div>
    </fieldset>
  </form>
</template>

<style scoped lang="postcss">
fieldset {
  --input-size: 1rem;
  --input-color: var(--menu-accent2);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 0.5em;
  padding-top: 1.5em;
  max-width: 420px;
  max-height: 100%;

  &:has([type="checkbox"]) {
    flex-direction: column;
    gap: 0.5em;

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
      margin-bottom: 0.2em;
      cursor: pointer;
    }

    &:hover {
      color: var(--input-color);
    }

    &:has([type="checkbox"]) {
      flex-direction: row;
    }

    &:has(:disabled) > * {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  & legend {
    position: absolute;
    top: 0;
    left: 0;
    font-size: smaller;
    font-weight: bold;
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
    background: url(sakura.png);
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
      background: url(coin.png);
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

.icon {
  font-size: 1.5em;
  margin-left: 0.5em;
  margin-bottom: 0.2em;
}

a:hover {
  color: var(--menu-accent1);
}
</style>
