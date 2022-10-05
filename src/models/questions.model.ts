import { supabase } from "../lib/supabase";
import { definitions } from "../supabase.types";
import { Answer } from "./answers.model";

export type Question = definitions["questions"];

export const getQuestions = async (teamId: string) => {
  const { data: answeredQuestionsId } = await supabase
    .from<Answer>("answers")
    .select("question_id")
    .eq("team_id", teamId);

  const { count, data, error } = await supabase
    .from<Question>("questions")
    .select("*", { count: "exact" })
    .not(
      "id",
      "in",
      `(${(answeredQuestionsId || []).map((answer) => answer.question_id)})`
    );

  if (error) console.error(error);

  return {
    data,
    count,
  };
};

export type InsertQuestionData = Omit<Question, "id" | "created_at">;

export const createQuestion = async ({ text }: InsertQuestionData) => {
  const { data, error } = await supabase
    .from<Question>("questions")
    .insert([{ text }])
    .single();

  if (error) console.error(error);

  return {
    data,
  };
};
