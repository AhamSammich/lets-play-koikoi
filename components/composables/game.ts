export const useRoundNum = () => useState("roundNum", () => 1);
export const useScore1 = () => useState("score1", () => 0);
export const useScore2 = () => useState("score2", () => 0);
export const useActiveP = () => useState("activeP", () => "p1");
export const useWait = () => useState("waiting", () => false);