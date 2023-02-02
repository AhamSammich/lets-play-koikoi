type CheckCardType = (cardname: string) => boolean;

type CardDetails = {
  flower: string
  isBright: boolean
  isAnimal: boolean
  isRibbon: boolean
  isPlain: boolean
}

type Card = Record<string, CardDetails>