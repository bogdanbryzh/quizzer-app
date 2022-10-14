import { useAtom } from "jotai";
import { teamIsFinishedAlready } from "../store/team";

function Outro() {
  const [teamAlreadyFinished] = useAtom(teamIsFinishedAlready);

  return (
    <>
      <h1 className="text-5xl font-bold text-center">Благословінь!</h1>
      {teamAlreadyFinished && (
        <p className="text-center text-xl py-6">Гарна спроба, guys 🤭</p>
      )}
    </>
  );
}

export default Outro;
