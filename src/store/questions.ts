import { atomWithStorage } from "jotai/utils";
import { Question } from "../models/questions.model";

export type StoredQuestions = Question & { answered: boolean };

export const questionsAtom = atomWithStorage<StoredQuestions[]>(
  "questions",
  []
);

export const currentQuestionAtom = atomWithStorage<number>(
  "currentQuestion",
  0
);
