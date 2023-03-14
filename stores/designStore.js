import { defineStore } from "pinia";

export const useDesignStore = defineStore("design", {
  state: () => ({
    cardDesigns: {
      "ramen-red": {
        name: "Ramen Red",
        attribution: "Classic Hwatu design seen in Hanafuda Koi-Koi Ramen!",
        urlDescription: "Download and play for free!",
        url: "https://pelicapp.itch.io/hanafuda",
        reversed: false,
      },
      "flash-black": {
        name: "Flash Black",
        attribution: "Design from Hanafuda Flash and gamedesign.jp!",
        urlDescription: "Free to play online!",
        url: "https://www.gamedesign.jp/sp/hanafuda",
        reversed: false,
      },
      "nobori-blue": {
        name: "Nobori Blue",
        attribution: "Koinobori Handafuda brought to you by IndianWolf Studios LLC!",
        urlDescription: "Back their project on Kickstarter!",
        url: "https://www.kickstarter.com/projects/iws/koinobori-playing-cards-hanafuda-poker-plastic",
        reversed: false,
      },
      "sabling-silver": {
        name: "Sabling Silver",
        attribution: "Pokemon handafuda designed by SablingArt!",
        urlDescription: "Find more from @SablingArt on Tumblr, Twitter and Etsy!",
        url: "https://sablingart.tumblr.com",
        reversed: true,
      },
      "hanami-hue": {
        name: "Hanami Hue",
        attribution: "Hanami Hanafuda designed by Jason Johnson of IndianWolf Studios LLC and illustrated by Antonietta Fazio-Johnson of Inner Hue Art Studio LLC!",
        urlDescription: "Get this deck and more from IndianWolf Studios!",
        url: "https://indianwolfstudios.com/shop/",
        reversed: false,
      },
    },
    cardBacks: {
      "sabling-silver": "cards/sabling-silver/webp/card-back.webp"
    },
    activeDesign: "flash-black",
  }),
});
