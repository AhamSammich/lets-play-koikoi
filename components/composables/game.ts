import { Ref } from "vue";

export const STORE: Record<string, () => Ref> = {
    useRoundNum: () => useState("roundNum", () => 1),
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
}

export function addState(stateName: string, initVal: unknown) {
    let prop = `use${stateName[0].toUpperCase}${stateName.slice(1)}`;
    Object.defineProperty(STORE, prop, () => useState(stateName, () => initVal));
    return STORE[prop];
}