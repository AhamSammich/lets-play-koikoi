import { defineStore } from "pinia";

type CardPlayer = {
  cardsInHand: Set<string>;
  collectedCards: Set<string>;
  completedYaku: Set<Yaku>;
};

type Yaku = {
  name: string;
  cards: string[];
};

export const usePlayerStore = defineStore("player", {
  state: () =>
    <Record<string, CardPlayer>>{
      p1: {
        cardsInHand: new Set(),
        collectedCards: new Set(),
        completedYaku: new Set(),
      },
      p2: {
        cardsInHand: new Set(),
        collectedCards: new Set(),
        completedYaku: new Set(),
      },
    },
  actions: {
    updateCardsInHand(player: string, newHand: string[]) {
      this[player].cardsInHand = new Set(newHand);
      // console.dir(
      //   `${player.toUpperCase()} dealt hand: ${[...this[player].cardsInHand]}`
      // );
    },
    removeCardFromHand(player: string, card: string) {
      let cardRemoved = this[player].cardsInHand.delete(card);
      if (cardRemoved)
        console.dir(`Removed ${card} from ${player.toUpperCase()}'s hand.`);
    },
    addCollectedCards(player: string, newCards: string[]) {
      newCards.forEach((card) => this[player].collectedCards.add(card));
      console.dir(
        `${player.toUpperCase()} collected ${newCards}.\n\tCollection: ${
          this[player].collectedCards.size
        } cards`
      );
    },
    addCompletedYaku(player: string, newYaku: Dict) {
      for (let yakuName in newYaku) {
        this[player].completedYaku.add({
          name: yakuName,
          cards: newYaku[yakuName],
        });
        console.dir(
          `${player.toUpperCase()} completed ${yakuName}.\n\tYaku: ${[
            ...this[player].completedYaku.values(),
          ]}`
        );
      }
    },
    clearCollections() {
      this.p1.collectedCards.clear();
      this.p2.collectedCards.clear();
    },
  },
  getters: {
    activeHandIsEmpty: (state) => {
      return (player: string) => state[player].cardsInHand.size === 0;
    },
  },
});
