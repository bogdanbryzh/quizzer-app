import { atomWithStorage } from "jotai/utils";

export const TIMER_TIME = 12 * 60 * 1000;

export const timerAtom = atomWithStorage("timer", TIMER_TIME);
