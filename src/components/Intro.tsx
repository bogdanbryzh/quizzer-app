import { useAtom } from "jotai";
import { stageAtom } from "../store/stage";
import { teamAtom, teamIsFinishedAlready } from "../store/team";

function Intro() {
  const [, setStage] = useAtom(stageAtom);
  const [, setTeamAlreadyFinished] = useAtom(teamIsFinishedAlready);
  const [team] = useAtom(teamAtom);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-6xl font-bold">Point name</h1>
      <p className="py-6">Some text with rules, maybe</p>
      <button
        className="btn btn-primary"
        onClick={() => {
          if (team?.id) {
            setStage("quiz");

            setTeamAlreadyFinished(team?.finished ?? false);
          } else setStage("picker");
        }}
      >
        Почати
      </button>
    </div>
  );
}

export default Intro;
