import { supabase } from "../lib/supabase";
import { definitions } from "../supabase.types";
import { Question } from "./questions.model";
import { Team } from "./teams.model";

export type Answer = definitions["answers"];

export type AnswerWithTeamAndQuestion = Pick<Answer, "text"> & {
  teams: { name: Team["name"] };
} & {
  questions: { text: Question["text"] };
};

export const getAnswers = async () => {
  const { count, data, error } = await supabase
    .from<AnswerWithTeamAndQuestion>("answers")
    .select(`text, teams (name), questions (text)`, { count: "exact" });

  if (error) throw error;

  return {
    data,
    count,
  };
};

export type InsertAnswerData = Omit<Answer, "id" | "created_at">;

export const createAnswer = async ({
  question_id,
  team_id,
  text,
}: InsertAnswerData) => {
  const { data, error } = await supabase
    .from<Answer>("answers")
    .insert([{ question_id, team_id, text }])
    .single();

  if (error) throw error;

  return {
    data,
  };
};
