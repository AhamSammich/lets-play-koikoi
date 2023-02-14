type CheckCardType = (cardname: string) => boolean;

type CardDetails = {
  flower: string;
  isBright: boolean;
  isAnimal: boolean;
  isRibbon: boolean;
  isPlain: boolean;
};

type Card = Record<string, CardDetails>;

type Dict = Record<string, string[]>;

type MultiDict = Record<string, string | Dict>;

type Player = {
  hand: Ref<string[]>;
  collection: Ref<string[]>;
  yaku: Ref<Dict>;
  score: Ref<number>;
  koikoi: number;
};