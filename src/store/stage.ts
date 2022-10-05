import { atom } from "jotai";

type Stage = "intro" | "picker" | "quiz" | "outro";

export const stageAtom = atom<Stage>("intro");
