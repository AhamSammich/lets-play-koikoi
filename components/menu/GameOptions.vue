<script setup lang="ts">
import { Ref } from "vue";

const rules: Record<string, Ref> = {
  maxRounds: <Ref<number>>RULES.useMaxRounds(),
  viewingsAllowed: <Ref<number>>RULES.useViewingsAllowed(),
  bonusForAnyKoiKoi: <Ref<boolean>>RULES.useBonusForAnyKoiKoi(),
  doubledOverSeven: <Ref<boolean>>RULES.useDoubledOverSeven(),
};

// function applyOptions(e) {
//   e.preventDefault();
//   const formData = [...e.target.querySelectorAll("input:checked")].map(input => [input.name, input.value]);
//   console.log(formData);

// }

function updateNumberRule(e: Event) {
  let target = <HTMLElement>e.target;
  let key = target.getAttribute("name");
  if (!key) return;
  rules[key].value = Number(target.getAttribute("value"));
}

// @ts-ignore
function updateBooleanRule(e) {
  rules[e.target.name].value = e.target.checked;
}
</script>

<template>
  <form class="grid gap-1" @submit.prevent>
    <!-- choose number of rounds: 3 / 6 / 12 -->
    <fieldset>
      <legend>Game Length</legend>
      <div>
        <label for="length-season">Season</label>
        <input
          type="radio"
          id="length-season"
          name="maxRounds"
          value="3"
          @change="updateNumberRule"
        />
      </div>
      <div>
        <label for="length-half">Half</label>
        <input
          type="radio"
          id="length-half"
          name="maxRounds"
          value="6"
          @change="updateNumberRule"
        />
      </div>
      <div>
        <label for="length-year">Year</label>
        <input
          type="radio"
          id="length-year"
          name="maxRounds"
          value="12"
          @change="updateNumberRule"
          checked
        />
      </div>
    </fieldset>
    <!-- allow hanami-zake/tsukimi-zake: always / limited / never -->
    <fieldset>
      <legend>Allow "Flower/Moon Viewing"</legend>
      <div>
        <label for="viewings-never">Never</label>
        <input
          type="radio"
          id="viewings-never"
          name="viewingsAllowed"
          value="1"
          @change="updateNumberRule"
        />
      </div>
      <div>
        <label for="viewings-limited">Limited</label>
        <input
          type="radio"
          id="viewings-limited"
          name="viewingsAllowed"
          value="2"
          @change="updateNumberRule"
        />
      </div>
      <div>
        <label for="viewings-always">Always</label>
        <input
          type="radio"
          id="viewings-always"
          name="viewingsAllowed"
          value="3"
          @change="updateNumberRule"
          checked
        />
      </div>
    </fieldset>
    <!-- select additional scoring rules: x2 any koi-koi / x2 if >7pts -->
    <fieldset>
      <legend>Additional Scoring Rules</legend>
      <div>
        <input
          type="checkbox"
          id="scoring-double-any"
          name="bonusForAnyKoiKoi"
          @change="updateBooleanRule"
        />
        <label for="scoring-double-any">x2 for any koi-koi</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="scoring-double-seven"
          name="doubledOverSeven"
          @change="updateBooleanRule"
        />
        <label for="scoring-double-seven">x2 for yaku >7 points</label>
      </div>
    </fieldset>
    <!-- <button type="submit">Apply</button> -->
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
  padding: 1.5em 0.5em;

  &:has([type="checkbox"]) {
    flex-direction: column;
    gap: 0.25em;

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
    --input-size: 0.8rem;
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
</style>
