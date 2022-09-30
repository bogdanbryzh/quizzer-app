import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Team } from "../models/teams.model";

export const teamAtom = atomWithStorage<Team | null>("team", null);

export const teamIdAtom = atom((get) => get(teamAtom)?.id ?? null);
