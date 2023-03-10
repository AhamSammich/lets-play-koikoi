import { defineStore } from "pinia";

export const useDesignStore = defineStore("design", {
  state: () => ({
    cardDesigns: {
      "ramen-red": {
        name: "Ramen Red",
        attribution: "Design from Hanafuda Koi-Koi Ramen!",
        urlDescription: "Download their app for free!",
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
        attribution: "Koinobori Handafuda designed by IndianWolf Studios!",
        urlDescription: "Back their project on Kickstarter!",
        url: "https://www.kickstarter.com/projects/iws/koinobori-playing-cards-hanafuda-poker-plastic",
        reversed: false,
      },
      "sabling-silver": {
        name: "Sabling Silver",
        attribution: "Pokemon handafuda designed by Sabling!",
        urlDescription: "Follow @sablingart on Tumblr!",
        url: "https://sablingart.tumblr.com",
        reversed: true,
      },
    },
    activeDesign: "flash-black",
  }),
});
