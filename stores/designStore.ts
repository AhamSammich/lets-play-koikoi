import { defineStore } from "pinia";

type cardDesign = {
  name: string;
  title: string;
  attribution?: string;
  urlDescription?: string;
  url?: string;
  backImage?: boolean;
  arrangement?: {
    reversed?: boolean;
    orderByName?: string[];
  };
};

const CARD_DESIGNS: Record<string, cardDesign> = {
  "nishiki-fuda": {
    name: "nishiki-fuda",
    title: "Nishiki Fuda",
    attribution: "Design by Hanako of Estudio Artes in Osaka, Japan!",
    urlDescription: "Buy this deck and others from their online store!",
    url: "https://nishikie.stores.jp",
  },
  "sabling-art": {
    name: "sabling-art",
    title: "Sabling Art",
    attribution: "Pokemon handafuda designed by SablingArt!",
    urlDescription: "Find more from @SablingArt on Tumblr, Twitter and Etsy!",
    url: "https://sablingart.tumblr.com",
    backImage: true,
    arrangement: { reversed: true },
  },
  "hanami-hue": {
    name: "hanami-hue",
    title: "Hanami",
    attribution:
      "Hanami Hanafuda designed by Jason Johnson of IndianWolf Studios LLC and illustrated by Antonietta Fazio-Johnson of Inner Hue Art Studio LLC!",
    urlDescription: "Get this deck and more from IndianWolf Studios!",
    url: "https://indianwolfstudios.com/shop/",
  },
  "kc-original": {
    name: "kc-original",
    title: "Moon Rabbit Original",
    attribution:
      "Moon Rabbit Handafuda cards designed and illustrated by Kelsey Cretcher!",
    urlDescription: "Find more from Kelsey on DeviantArt!",
    url: "https://www.deviantart.com/kcretcher",
    arrangement: {
      orderByName: [
        "matsu-no-tan",
        "matsu-no-kasu-2",
        "matsu-no-kasu-1",
        "matsu-ni-tsuru",
        "ume-no-tan",
        "ume-no-kasu-2",
        "ume-no-kasu-1",
        "ume-ni-uguisu",
        "sakura-no-tan",
        "sakura-no-kasu-2",
        "sakura-no-kasu-1",
        "sakura-ni-maku",
        "fuji-no-kasu-2",
        "fuji-no-kasu-1",
        "fuji-no-tan",
        "fuji-ni-kakku",
        "ayame-no-kasu-2",
        "ayame-no-tan",
        "ayame-no-kasu-1",
        "ayame-ni-yatsuhashi",
        "botan-no-tan",
        "botan-no-kasu-2",
        "botan-no-kasu-1",
        "botan-ni-chou",
        "hagi-no-kasu-2",
        "hagi-no-tan",
        "hagi-no-kasu-1",
        "hagi-ni-inoshishi",
        "susuki-no-kasu-2",
        "susuki-no-kasu-1",
        "susuki-ni-kari",
        "susuki-ni-tsuki",
        "kiku-no-tan",
        "kiku-no-kasu-2",
        "kiku-no-kasu-1",
        "kiku-ni-sakazuki",
        "momiji-no-tan",
        "momiji-no-kasu-2",
        "momiji-no-kasu-1",
        "momiji-ni-shika",
        "yanagi-no-kasu",
        "yanagi-ni-tsubame",
        "yanagi-no-tan",
        "yanagi-ni-ono-no-toufuu",
        "kiri-ni-ho-oh",
        "kiri-no-kasu-3",
        "kiri-no-kasu-2",
        "kiri-no-kasu-1",
      ],
    },
  },
  "nobori-blue": {
    name: "nobori-blue",
    title: "Koinobori",
    attribution:
      "Koinobori Handafuda brought to you by IndianWolf Studios LLC!",
    urlDescription: "Back their project on Kickstarter!",
    url: "https://www.kickstarter.com/projects/iws/koinobori-playing-cards-hanafuda-poker-plastic",
  },
  "parish-cherry": {
    name: "parish-cherry",
    title: "Parish Cherry",
    attribution:
      "Design by Parish Cherry, an illustrator & graphic designer based in Los Angeles, California!",
    urlDescription: "See more at ParishCherry.com!",
    url: "https://parishcherry.com",
    backImage: true,
  },
  "flash-black": {
    name: "flash-black",
    title: "Flash Black",
    attribution: "Traditional design from Hanafuda Flash and gamedesign.jp!",
    urlDescription: "Free to play online!",
    url: "https://www.gamedesign.jp/sp/hanafuda",
  },
  "ramen-red": {
    name: "ramen-red",
    title: "Ramen Red",
    attribution: "Classic Hwatu design seen in Hanafuda Koi-Koi Ramen!",
    urlDescription: "Download and play for free!",
    url: "https://pelicapp.itch.io/hanafuda",
  },
};

export const useDesignStore = defineStore("design", {
  state: () => ({
    defaultDesignName: "flash-black",
    activeDesignName: "flash-black",
  }),
  actions: {
    setActiveDesign(designName?: string | null) {
      if (!designName) {
        this.activeDesignName = this.defaultDesignName;
      } else if (this.getDesignNames.includes(designName)) {
        this.activeDesignName = designName;
      } else {
        console.warn(
          `${designName} not found in available designs.\nDefault design (${this.defaultDesignName}) was used instead.`
        );
      }
    },
  },
  getters: {
    hasBackImage: (state) => CARD_DESIGNS[state.activeDesignName].backImage,
    getDesigns: () => CARD_DESIGNS,
    getDesignNames: () => Object.keys(CARD_DESIGNS),
    getDefaultDesign: (state) => CARD_DESIGNS[state.defaultDesignName],
    getActiveDesign: (state) => CARD_DESIGNS[state.activeDesignName],
    getDesignByName: (state) => {
      (designName: string) => CARD_DESIGNS[designName];
    },
  },
});
