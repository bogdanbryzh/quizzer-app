import {
  ArrowRightOnRectangleIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getTeams, Team, verifyTeam } from "../models/teams.model";
import { stageAtom } from "../store/stage";
import { teamAtom } from "../store/team";

function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isTeamVerified, setIsTeamVerified] = useState<boolean>(false);
  const [, setStage] = useAtom(stageAtom);
  const [, setTeam] = useAtom(teamAtom);

  useEffect(() => {
    getTeams().then(({ data }) => {
      setTeams(data ?? []);
    });
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ pin: string }>({ defaultValues: { pin: "" } });

  const teamVerificationHandler = handleSubmit(({ pin }) => {
    if (selectedTeam?.finished) {
      setStage("outro");
      setTeam(selectedTeam);
    }

    if (verifyTeam(selectedTeam!, pin) && !selectedTeam?.finished) {
      setIsTeamVerified(true);

      setTeam(selectedTeam);

      setTimeout(() => setStage("quiz"), 400);
    }
  });

  return (
    <div>
      {teams.length ? (
        <div className="overflow-y-auto">
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
              <h3 className="font-bold text-lg">{selectedTeam?.name}</h3>
              <p>Введіть пін-код вашої команди</p>

              <form
                className="form-control mt-6"
                onSubmit={teamVerificationHandler}
              >
                {errors.pin ? <span>{errors.pin.message}</span> : null}
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
        "loading"
      )}
    </div>
  );
}

export default Teams;
