import { Ref } from "vue";

export const STORE: Record<string, () => Ref> = {
    useRoundNum: () => useState("roundNum", () => 0),
    useCurrentOya: () => useState("currentOya", () => 1),
    useScore1: () => useState("score1", () => 0),
    useScore2: () => useState("score2", () => 0),

    useHand1: () => useState("hand1", () => <string[]>[]),
    useHand2: () => useState("hand2", () => <string[]>[]),
    useField: () => useState("field", () => <string[]>[]),
    useCollection1: () => useState("collection1", () => <string[]>[]),
    useCollection2: () => useState("collection2", () => <string[]>[]),
    useYaku1: () => useState("yaku1", () => <Dict>{}),
    useYaku2: () => useState("yaku2", () => <Dict>{}),

    useActiveP: (): Ref<string> => useState("activeP", () => "p1"),
    useWait: () => useState("waiting", () => false),
    useStart: () => useState("start", () => false),

    usePreview: (): Ref<string> => useState("cardPreview", () => ""),
}

export const RULES: Record<string, () => Ref> = {
    useMaxRounds: () => useState("maxRounds", () => 12),
    useViewingsAllowed: () => useState("viewingsAllowed", () => 2),
    useBonusForAnyKoiKoi: () => useState("bonusForAnyKoiKoi", () => false),
    useDoubledOverSeven: () => useState("doubledOverSeven", () => false),
    useCardStyle: () => useState("cardStyle", () => "ramen-red"),
}
