const SPECIAL_YAKU: Record<string, Set<string>> = {
  "ino-shika-chou": new Set([
    "hagi-ni-inoshishi",
    "botan-ni-chou",
    "momiji-ni-shika",
  ]),
  "hanami-zake": new Set(["sakura-ni-maku", "kiku-ni-sakazuki"]),
  "tsukimi-zake": new Set(["susuki-ni-tsuki", "kiku-ni-sakazuki"]),
  "aka-tan": new Set(["matsu-no-tan", "ume-no-tan", "sakura-no-tan"]),
  "ao-tan": new Set(["botan-no-tan", "kiku-ni-sakazuki", "momiji-no-tan"]),
};

const BRIGHTS = [
  "matsu-ni-tsuru",
  "sakura-ni-maku",
  "susuki-ni-tsuki",
  "yanagi-ni-ono-no-toufuu",
  "kiri-ni-ho-oh",
];

const isBright: CheckCardType = (cardName) => BRIGHTS.includes(cardName);
const isAnimal: CheckCardType = (cardName) =>
  !isBright(cardName) && /-ni-/.test(cardName);
const isRibbon: CheckCardType = (cardName) => /-no-tan/.test(cardName);
const isPlain: CheckCardType = (cardName) => /-no-kasu/.test(cardName);

export const getFlower = (cardName: string): string => cardName.split("-")[0];

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

function checkForBrights(cardArr: string[]): string {
  let numBrights = cardArr.filter((card) => isBright(card)).length;
  if (numBrights === 5) return "gokou";
  if (numBrights === 4 && cardArr.includes("yanagi-ni-ono-no-toufuu"))
    return "ame-shikou";
  if (numBrights === 4) return "shikou";
  if (numBrights === 3) return "sankou";
  return "";
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
