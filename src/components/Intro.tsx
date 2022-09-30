import { useAtom } from "jotai";
import { stageAtom } from "../store/stage";
import { teamIdAtom } from "../store/team";

function Intro() {
  const [, setStage] = useAtom(stageAtom);
  const [teamId] = useAtom(teamIdAtom);

  return (
    <>
      <h1 className="text-5xl font-bold">Hello there</h1>
      <p className="py-6">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia quos
        ipsam eos vitae assumenda nulla adipisci voluptatum, repellendus ducimus
        ipsum!
      </p>
      <button
        className="btn btn-primary"
        onClick={() => {
          if (teamId) setStage("quiz");
          else setStage("picker");
        }}
      >
        Почати
      </button>
    </>
  );
}

export default Intro;
