import { defineStore } from "pinia";

export const useTableStore = defineStore("tabletop", {
  state: () => ({
    selectedCard: "", // player selected
    previewCard: "", // show possible matches for this card
    matchingCards: <Set<string>>new Set(), // cards to collect at end of turn
    fieldCards: <Set<string>>new Set(),
  }),
  actions: {
    updateFieldCards(newField: string[]) {
        this.fieldCards = new Set(newField);
        console.log(`Cards dealt to the table: ${[...this.fieldCards]}`)
    },
    removeFieldCard(card: string) {
        this.fieldCards.delete(card);
        console.log(`Removed ${card} from the table.`);
    },
    addFieldCard(card: string) {
        this.fieldCards.add(card);
        console.log(`Added ${card} to the table.`);
    },
    clearField() {
        this.fieldCards.clear();
    },

    setSelectedCard(card: string) {
      this.selectedCard = card;
      this.addMatchingCards(card);
    },
    clearSelectedCard() {
        this.selectedCard = "";
        this.matchingCards.clear();
    },

    setPreviewCard(card: string) {
        this.previewCard = card;
        this.addMatchingCards(card);
    },
    addMatchingCards(cardToMatch: string) {
      [...this.fieldCards]
        .filter((card) => getFlower(card) === getFlower(cardToMatch))
        .forEach((match) => this.matchingCards.add(match));
      console.log(
        `Showing matches for ${cardToMatch}:\n\t${this.matchingCards.size} found.`
      );
    },
    clearPreview() {
        this.previewCard = "";
        // this.matchingCards.clear();
    },

    matchesPreviewCard(card: string) {
        return getFlower(card) === getFlower(this.previewCard)
    },
    matchesSelectedCard(card: string) {
        return getFlower(card) === getFlower(this.selectedCard)
    },
  },
  getters: {
    cardSelected: (state) => state.selectedCard,
    getFieldMatches: (state) => [...state.fieldCards].filter(card => getFlower(card) === getFlower(state.selectedCard || state.previewCard)),
},
});
