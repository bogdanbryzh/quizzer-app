import { supabase } from "../lib/supabase";
import { definitions } from "../supabase.types";

export type Team = definitions["teams"];

export const getTeams = async () => {
  const { count, data, error } = await supabase
    .from<Team>("teams")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (error) console.error(error);

  return {
    data,
    count,
  };
};

export const markTeamFinished = async (teamId: string) => {
  const { error } = await supabase
    .from<Team>("teams")
    .update({ finished: true })
    .eq("id", teamId);

  if (error) throw error;
};
export const verifyTeam = (team: Team, pin: Team["pin"]): boolean =>
  team.pin === pin;
