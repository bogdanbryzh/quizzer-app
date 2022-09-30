import { useAtom } from "jotai";
import { teamAtom } from "../store/team";

function Outro() {
  const [team] = useAtom(teamAtom);

  return (
    <>
      <h1 className="text-4xl font-bold text-center">Good luck</h1>
      {team?.finished ? <p className="text-center text-lg">Гарна спроба :)</p> : null}
    </>
  );
}

export default Outro;
