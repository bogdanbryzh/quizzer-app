import { supabase } from "../lib/supabase";
import { definitions } from "../supabase.types";

export type Question = definitions["questions"];

export const getQuestions = async () => {
  const { count, data, error } = await supabase
    .from<Question>("questions")
    .select("*", { count: "exact" });

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
