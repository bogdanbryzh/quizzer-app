import { atom } from "jotai";
import { Question } from "../models/questions.model";

export const questionsAtom = atom<Question[]>([]);

export const currentQuestionAtom = atom<number>(0);
