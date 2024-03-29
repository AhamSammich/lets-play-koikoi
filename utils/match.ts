export const CARDS = [
  "matsu-ni-tsuru",
  "matsu-no-tan",
  "matsu-no-kasu-1",
  "matsu-no-kasu-2",
  "ume-ni-uguisu",
  "ume-no-tan",
  "ume-no-kasu-1",
  "ume-no-kasu-2",
  "sakura-ni-maku",
  "sakura-no-tan",
  "sakura-no-kasu-1",
  "sakura-no-kasu-2",
  "ayame-ni-yatsuhashi",
  "ayame-no-tan",
  "ayame-no-kasu-1",
  "ayame-no-kasu-2",
  "hagi-ni-inoshishi",
  "hagi-no-tan",
  "hagi-no-kasu-1",
  "hagi-no-kasu-2",
  "botan-ni-chou",
  "botan-no-tan",
  "botan-no-kasu-1",
  "botan-no-kasu-2",
  "fuji-ni-kakku",
  "fuji-no-tan",
  "fuji-no-kasu-1",
  "fuji-no-kasu-2",
  "susuki-ni-tsuki",
  "susuki-ni-kari",
  "susuki-no-kasu-1",
  "susuki-no-kasu-2",
  "kiku-ni-sakazuki",
  "kiku-no-tan",
  "kiku-no-kasu-1",
  "kiku-no-kasu-2",
  "momiji-ni-shika",
  "momiji-no-tan",
  "momiji-no-kasu-1",
  "momiji-no-kasu-2",
  "yanagi-ni-ono-no-toufuu",
  "yanagi-ni-tsubame",
  "yanagi-no-tan",
  "yanagi-no-kasu",
  "kiri-ni-ho-oh",
  "kiri-no-kasu-1",
  "kiri-no-kasu-2",
  "kiri-no-kasu-3",
];

export const CARDS_REV = [
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
  "kiku-no-kasu-1",
  "kiku-no-tan",
  "kiku-ni-sakazuki",
  "momiji-no-kasu-2",
  "momiji-no-kasu-1",
  "momiji-no-tan",
  "momiji-ni-shika",
  "yanagi-no-kasu",
  "yanagi-no-tan",
  "yanagi-ni-tsubame",
  "yanagi-ni-ono-no-toufuu",
  "kiri-no-kasu-3",
  "kiri-no-kasu-2",
  "kiri-no-kasu-1",
  "kiri-ni-ho-oh",
];

export const SPECIAL_YAKU: Record<string, string[]> = {
  "ino-shika-chou": ["hagi-ni-inoshishi", "botan-ni-chou", "momiji-ni-shika"],
  "hanami-zake": ["sakura-ni-maku", "kiku-ni-sakazuki"],
  "tsukimi-zake": ["susuki-ni-tsuki", "kiku-ni-sakazuki"],
  "aka-tan": ["matsu-no-tan", "ume-no-tan", "sakura-no-tan"],
  "ao-tan": ["botan-no-tan", "kiku-no-tan", "momiji-no-tan"],
};

export const BRIGHTS = [
  "matsu-ni-tsuru",
  "sakura-ni-maku",
  "susuki-ni-tsuki",
  "yanagi-ni-ono-no-toufuu",
  "kiri-ni-ho-oh",
];

export const POINTS: Record<string, number> = {
  gokou: 15,
  shikou: 8,
  "ame-shikou": 7,
  sankou: 6,
  "ino-shika-chou": 5,
  "ao-tan": 5,
  "aka-tan": 5,
  "hanami-zake": 5,
  "tsukimi-zake": 5,
  "tane-zaku": 1,
  "tan-zaku": 1,
  kasu: 1,
  teshi: 6,
  kuttsuki: 6,
};

export const isBright: CheckCardType = (cardName) => BRIGHTS.includes(cardName);
export const isAnimal: CheckCardType = (cardName) =>
  !isBright(cardName) && /-ni-/.test(cardName);
export const isRibbon: CheckCardType = (cardName) => /-no-tan/.test(cardName);
export const isPlain: CheckCardType = (cardName) => /-no-kasu/.test(cardName);

export const getFlower = (cardName: string): string => cardName?.split("-")[0];
export const getName = (cardName: string): string =>
  cardName?.replace(/-\d?/g, " ").trim();

// Emit card details when element is clicked
export function addDetails(cardName: string): Card {
  let card = <Card>{};
  card[cardName] = {
    flower: getFlower(cardName),
    isBright: isBright(cardName),
    isAnimal: isAnimal(cardName),
    isRibbon: isRibbon(cardName),
    isPlain: isPlain(cardName),
  };
  return card;
}

export function checkForWinOrVoid(cardArr: string[]): string | null {
  // Check array for 4 of same suit/flower or 4 pairs
  // Returns name of found winning/voiding condition
  // Returns null if neither found
  let flowerArr = cardArr.map(getFlower);
  let flowerCount = new Map();
  for (let flower of flowerArr) {
    if (flowerCount.has(flower)) {
      flowerCount.set(flower, flowerCount.get(flower) + 1);
    } else {
      flowerCount.set(flower, 1);
    }
  }
  if ([...flowerCount.values()].every((count) => count === 2))
    return "kuttsuki";
  if ([...flowerCount.values()].some((count) => count === 4)) return "teshi";
  return null;
}

export function processYakuList(yakuList: Dict): Dict {
  let yakuArr = Object.keys(yakuList);
  if (yakuArr.filter((yakuName) => yakuName.endsWith("kou")).length < 2)
    return yakuList;

  if (yakuArr.includes("gokou")) {
    ["ame-shikou", "shikou", "sankou"].forEach((yaku) => delete yakuList[yaku]);
  } else if (yakuArr.includes("shikou")) {
    ["ame-shikou", "sankou"].forEach((yaku) => delete yakuList[yaku]);
  } else if (yakuArr.includes("ame-shikou")) {
    delete yakuList["sankou"];
  }
  return yakuList;
}

export function getYakuScore(yakuList: Record<string, string[]>): number {
  let total = 0;
  for (let yaku in yakuList) {
    let points = POINTS[yaku];
    switch (yaku) {
      case "tan-zaku":
      case "tane-zaku":
        points += yakuList[yaku].length - 5;
        break;
      case "kasu":
        points += yakuList[yaku].length - 10;
        break;
    }
    total += points;
  }
  console.log(Object.keys(yakuList), total + " points");
  return total;
}

function checkForBrights(cardArr: string[]): string {
  let rainMan = cardArr.includes("yanagi-ni-ono-no-toufuu");
  let numBrights = cardArr.filter((card) => isBright(card)).length;
  if (numBrights === 5) return "gokou";
  if (numBrights === 4 && rainMan) return "ame-shikou";
  if (numBrights === 4) return "shikou";
  if (numBrights === 3 && !rainMan) return "sankou";
  return "";
}

function checkForAnimals(cardArr: string[]): string {
  let animals = cardArr.filter((card) => isAnimal(card)).length;
  return animals >= 5 ? "tane-zaku" : "";
}

function checkForRibbons(cardArr: string[]): string {
  let ribbons = cardArr.filter((card) => isRibbon(card)).length;
  return ribbons >= 5 ? "tan-zaku" : "";
}

function checkForPlains(cardArr: string[]): string {
  let plains = cardArr.filter((card) => isPlain(card)).length;
  return plains >= 10 ? "kasu" : "";
}

function checkForSpecial(cardArr: string[]): string[] {
  let collection = new Set(cardArr);
  let completedYaku: string[] = Object.keys(SPECIAL_YAKU).filter((yaku) =>
    SPECIAL_YAKU[yaku].every((card) => collection.has(card))
  );
  return completedYaku;
}

export function checkForYaku(cardArr: string[]): string[] {
  let special = checkForSpecial(cardArr);
  let yaku = [checkForBrights, checkForAnimals, checkForRibbons, checkForPlains]
    .map((check) => check(cardArr))
    .filter((result) => result);
  return [...yaku, ...special];
}

export function getCardsInYaku(yakuName: string, cardArr: string[]): string[] {
  if (SPECIAL_YAKU[yakuName]) return SPECIAL_YAKU[yakuName];
  if (yakuName.includes("kou")) return cardArr.filter(isBright);
  if (yakuName === "tan-zaku") return cardArr.filter(isRibbon);
  if (yakuName === "tane-zaku") return cardArr.filter(isAnimal);
  if (yakuName === "kasu") return cardArr.filter(isPlain);
  return [];
}

export function removeSetFromArr(
  removeSet: Set<string>,
  fromArr: string[]
): string[] {
  // Returns new array without the given card
  return fromArr.filter((card) => !removeSet.has(card));
}

export function pickCardFromArr(cardArr: string[]): string {
  // Returns a random card from the given array
  let len = cardArr.length;
  let index = Math.floor(Math.random() * len);
  return cardArr[index];
}

export function matchCardInArr(cardName: string, cardArr: string[]): string[] {
  // Returns new array of cards in given array that match the given card's suit/flower
  return cardArr.filter((aCard) => aCard.startsWith(getFlower(cardName)));
}

export function sortCardsByType(cardArr: string[]): Record<string, string[]> {
  return {
    brights: cardArr?.filter(isBright) || [],
    animals: cardArr?.filter(isAnimal) || [],
    ribbons: cardArr?.filter(isRibbon) || [],
    plains: cardArr?.filter(isPlain) || [],
  };
}
