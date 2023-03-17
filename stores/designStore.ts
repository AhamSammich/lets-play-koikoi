import { defineStore } from "pinia";

type cardDesign = {
  name: string;
  attribution?: string;
  urlDescription?: string;
  url?: string;
  reversed?: boolean;
  backImage?: boolean;
}
export const useDesignStore = defineStore("design", {
  state: () => ({
    activeDesign: "flash-black",
    cardDesigns: (<Record<string, cardDesign>>{
      "nobori-blue": {
        name: "Koinobori",
        attribution: "Koinobori Handafuda brought to you by IndianWolf Studios LLC!",
        urlDescription: "Back their project on Kickstarter!",
        url: "https://www.kickstarter.com/projects/iws/koinobori-playing-cards-hanafuda-poker-plastic",
      },
      "sabling-silver": {
        name: "SablingArt",
        attribution: "Pokemon handafuda designed by SablingArt!",
        urlDescription: "Find more from @SablingArt on Tumblr, Twitter and Etsy!",
        url: "https://sablingart.tumblr.com",
        reversed: true,
        backImage: true,
      },
      "hanami-hue": {
        name: "Hanami",
        attribution: "Hanami Hanafuda designed by Jason Johnson of IndianWolf Studios LLC and illustrated by Antonietta Fazio-Johnson of Inner Hue Art Studio LLC!",
        urlDescription: "Get this deck and more from IndianWolf Studios!",
        url: "https://indianwolfstudios.com/shop/",
      },
      "ramen-red": {
        name: "Ramen Red",
        attribution: "Classic Hwatu design seen in Hanafuda Koi-Koi Ramen!",
        urlDescription: "Download and play for free!",
        url: "https://pelicapp.itch.io/hanafuda",
      },
      "flash-black": {
        name: "Flash Black",
        attribution: "Traditional design from Hanafuda Flash and gamedesign.jp!",
        urlDescription: "Free to play online!",
        url: "https://www.gamedesign.jp/sp/hanafuda",
      },
    }),
  }),
  actions: {
    changeActive(designName: string) {
      if (this.cardDesigns[designName]) this.activeDesign = designName;
    }
  },
  getters: {
    hasBackImage: (state) => state.cardDesigns[state.activeDesign].backImage,
    getActiveProps: (state) => state.cardDesigns[state.activeDesign],
  }
});
