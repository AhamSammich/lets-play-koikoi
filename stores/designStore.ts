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
  "cherry-version": {
    name: "cherry-version",
    title: "Cherry Version",
    attribution:
      "Design by Parish Cherry, an illustrator & graphic designer based in Honolulu, HI!",
    urlDescription: "See more at ParishCherry.com!",
    url: "https://parishcherry.com",
    backImage: true,
  },
  "modern": {
    name: "modern",
    title: "2012 Modern",
    attribution:
      "Sarah Thomas designed this beautiful set of Modern Hanafuda and launched her successful Kickstarter in 2012!",
    urlDescription: "Revisit the journey at ModernHanafuda.net!",
    url: "http://www.modernhanafuda.net",
    arrangement: {
      orderByName: [
        "matsu-no-kasu-2",
        "matsu-no-kasu-1",
        "matsu-no-tan",
        "matsu-ni-tsuru",
        "ume-no-kasu-2",
        "ume-no-kasu-1",
        "ume-no-tan",
        "ume-ni-uguisu",
        "sakura-no-kasu-2",
        "sakura-no-kasu-1",
        "sakura-no-tan",
        "sakura-ni-maku",
        "fuji-no-kasu-2",
        "fuji-no-kasu-1",
        "fuji-no-tan",
        "fuji-ni-kakku",
        "ayame-no-kasu-2",
        "ayame-no-kasu-1",
        "ayame-no-tan",
        "ayame-ni-yatsuhashi",
        "botan-no-kasu-2",
        "botan-no-kasu-1",
        "botan-no-tan",
        "botan-ni-chou",
        "hagi-no-kasu-2",
        "hagi-no-kasu-1",
        "hagi-no-tan",
        "hagi-ni-inoshishi",
        "susuki-no-kasu-2",
        "susuki-no-kasu-1",
        "susuki-ni-kari",
        "susuki-ni-tsuki",
        "kiku-no-kasu-2",
        "kiku-no-tan",
        "kiku-ni-sakazuki",
        "kiku-no-kasu-1",
        "momiji-no-kasu-2",
        "momiji-no-kasu-1",
        "momiji-no-tan",
        "momiji-ni-shika",
        "yanagi-ni-tsubame",
        "yanagi-no-tan",
        "yanagi-ni-ono-no-toufuu",
        "yanagi-no-kasu",
        "kiri-no-kasu-3",
        "kiri-ni-ho-oh",
        "kiri-no-kasu-2",
        "kiri-no-kasu-1",
      ],
    },
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
  "hanami": {
    name: "hanami",
    title: "Hanami",
    attribution:
      "Hanami Hanafuda designed by Jason Johnson of IndianWolf Studios LLC and illustrated by Antonietta Fazio-Johnson of Inner Hue Art Studio LLC!",
    urlDescription: "Get this deck and more from IndianWolf Studios!",
    url: "https://indianwolfstudios.com/shop/",
  },
  "moon-rabbit": {
    name: "moon-rabbit",
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
  "koinobori": {
    name: "koinobori",
    title: "Koinobori",
    attribution:
      "Koinobori Handafuda brought to you by IndianWolf Studios LLC!",
    urlDescription: "Back their project on Kickstarter!",
    url: "https://www.kickstarter.com/projects/iws/koinobori-playing-cards-hanafuda-poker-plastic",
  },
  "nishiki-fuda": {
    name: "nishiki-fuda",
    title: "Nishiki Fuda",
    attribution: "Design by Hanako of Estudio Artes in Osaka, Japan!",
    urlDescription: "Buy this deck and others from their online store!",
    url: "https://nishikie.stores.jp",
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
