import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    menuOpen: false,
    showHints: true,
    gameInProgress: false,
    waitingForInput: false,
    drawPhase: <boolean | null>false,
  }),
  actions: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    openMenu() {
      this.menuOpen = true;
    },
    toggleHelp() {
      this.showHints = !this.showHints;
    },
    startGame() {
      this.gameInProgress = true;
    },
    endGame() {
      this.gameInProgress = false;
    },
    pauseGame() {
      this.waitingForInput = true;
    },
    toggleDrawPhase() {
      this.drawPhase = !this.drawPhase;
    },
    endRound() {
      this.drawPhase = null;
    },
    startRound() {
      this.drawPhase = false;
    }
  },
  getters: {
    gameIsRunning: (state) => state.gameInProgress,
    menuIsOpen: (state) => state.menuOpen,
    turnIsEnding: (state) => state.drawPhase === false,
  }
});
