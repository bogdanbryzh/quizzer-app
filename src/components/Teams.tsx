import {
  ArrowRightOnRectangleIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getTeams, Team, verifyTeam } from "../models/teams.model";
import { stageAtom } from "../store/stage";
import { teamAtom, teamIsFinishedAlready } from "../store/team";
import Loading from "./Loading";

function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isTeamVerified, setIsTeamVerified] = useState<boolean>(false);
  const [, setStage] = useAtom(stageAtom);
  const [, setTeam] = useAtom(teamAtom);
  const [, setTeamAlreadyFinished] = useAtom(teamIsFinishedAlready);

  useEffect(() => {
    getTeams().then(({ data }) => {
      setTeams(data ?? []);
    });
  });

  const TeamPinSchema = z.object({
    pin: z.string().min(4, {
      message: "Введіть пін повністю (якщо є нулі спереду, то їх також)",
    }),
  });

  type TeamPinData = z.infer<typeof TeamPinSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TeamPinData>({
    resolver: zodResolver(TeamPinSchema),
  });

  const teamVerificationHandler = handleSubmit(({ pin }) => {
    if (verifyTeam(selectedTeam!, pin)) {
      setTeam(selectedTeam);

      setIsTeamVerified(true);

      setTimeout(() => {
        if (selectedTeam?.finished) {
          setTeamAlreadyFinished(true);
          setStage("outro");
        } else {
          setStage("quiz");
        }
      }, 500);
    } else {
      setError("pin", {
        message:
          "Пін код введено неправильно. Якщо ви вважаєте, що ввели правильний пін код - зв'яжіться з адміністраторами",
      });
    }
  });

  return (
    <div>
      {teams.length ? (
        <div className="overflow-y-auto">
          <h2 className="text-6xl font-bold py-6">Виберіть вашу команду:</h2>
          <table className="table w-full">
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>
                    <label
                      htmlFor="team-modal"
                      className="w-full h-full"
                      onClick={() => {
                        setSelectedTeam(team);
                      }}
                    >
                      {team.name}
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <input type="checkbox" id="team-modal" className="modal-toggle" />
          <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box relative">
              <label
                htmlFor="team-modal"
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => {
                  reset();
                }}
              >
                <XMarkIcon width={20} />
              </label>
              <h3 className="font-bold text-2xl">{selectedTeam?.name}</h3>
              <p>Введіть пін-код вашої команди</p>

              <form
                className="form-control mt-2"
                onSubmit={teamVerificationHandler}
              >
                {errors.pin ? (
                  <span className="py-2 italic text-sm">
                    {errors.pin.message}
                  </span>
                ) : null}
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Пін-код"
                    className={`input input-bordered w-full ${
                      errors.pin && "input-error"
                    }`}
                    {...register("pin", { required: true, minLength: 4 })}
                  />
                  <button className="btn btn-square">
                    {isTeamVerified ? (
                      <CheckIcon width={20} />
                    ) : (
                      <ArrowRightOnRectangleIcon width={20} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Teams;
