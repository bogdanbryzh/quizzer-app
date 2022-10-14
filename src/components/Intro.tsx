import { useAtom } from "jotai";
import { stageAtom } from "../store/stage";
import { teamAtom, teamIsFinishedAlready } from "../store/team";

function Intro() {
  const [, setStage] = useAtom(stageAtom);
  const [, setTeamAlreadyFinished] = useAtom(teamIsFinishedAlready);
  const [team] = useAtom(teamAtom);

  return (
    <div className="flex flex-col">
      <h1 className="text-5xl font-bold mb-4">Запитання - відповідь</h1>
      <p className="my-2">Вітаємо вас на пункті!</p>
      <p className="my-2">
        Вам потрібно буде дати відповіді на запитання, які будуть з'являтись на
        екрані. У вас є 12 хвилин, тому будь ласка не зволікайте! Після того, як
        час сплине, ваша гра буде завершена. Також ви не зможете повернутися до
        попереднього питання, щоб відредагувати його, тому{" "}
        <span className="italic font-bold text-yellow-600">think twice</span>.
      </p>
      <p className="my-2">Готові? Тисніть кнопку!</p>
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
