import { atomWithStorage } from "jotai/utils";

type Stage = "intro" | "picker" | "quiz" | "outro";

export const stageAtom = atomWithStorage<Stage>("stage", "intro");
