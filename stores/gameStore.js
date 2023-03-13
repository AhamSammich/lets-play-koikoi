import { defineStore } from "pinia";

export const useGameStore = defineStore("game", () => {
    const menuOpen = ref(false);
    const toggleMenu = () => menuOpen.value = !menuOpen.value;
    
    const showHelp = ref(true);
    const toggleHelp = () => showHelp.value = !showHelp.value;

    return {
      menuOpen,
      toggleMenu,
      showHelp,
      toggleHelp,
    }
});
