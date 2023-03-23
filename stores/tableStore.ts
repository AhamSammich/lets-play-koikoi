import { defineStore } from "pinia";

export const useTableStore = defineStore("tabletop", {
  state: () => ({
    selectedCard: "", // player selected
    previewCard: "", // show possible matches for this card
    selectedMatch: "",
    matchingCards: <Set<string>>new Set(), // cards to collect at end of turn
    fieldCards: <Set<string>>new Set(),
    cardsToBeCollected: <string[]>[],
  }),
  actions: {
    updateFieldCards(newField: string[]) {
      this.fieldCards = new Set(newField);
    },
    removeFieldCard(card: string) {
      if (this.fieldCards.delete(card))
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
    setSelectedMatch(card: string) {
      if (this.checkSelectedMatches(card)) {
        console.log("Match selected: " + this.selectedMatch);
        this.selectedMatch = card;
      }
    },
    clearSelectedCards() {
      this.selectedCard = "";
      this.selectedMatch = "";
      this.matchingCards.clear();
      this.clearPreview();
    },

    setPreviewCard(card: string) {
      this.previewCard = card;
      this.addMatchingCards(card);
    },
    addMatchingCards(cardToMatch: string) {
      [...this.fieldCards]
        .filter((card) => getFlower(card) === getFlower(cardToMatch))
        .forEach((match) => this.matchingCards.add(match));
    },
    clearPreview() {
      this.previewCard = "";
    },

    checkPreviewMatches(card: string) {
      return getFlower(card) === getFlower(this.previewCard);
    },
    checkSelectedMatches(card: string) {
      return getFlower(card) === getFlower(this.selectedCard);
    },

    setCardsToBeCollected(cards: string[]) {
      this.cardsToBeCollected.push(...cards);
    },
    getCardsToBeCollected() {
      return this.cardsToBeCollected.splice(0);
    },
  },
  getters: {
    cardSelected: (state) => state.selectedCard,
    matchSelected: (state) => state.selectedMatch,
    cardsOnField: (state) => [...state.fieldCards],
    getFieldMatches: (state) =>
      [...state.fieldCards].filter(
        (card) =>
          getFlower(card) === getFlower(state.selectedCard || state.previewCard)
      ),
  },
});
