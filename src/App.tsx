import Intro from "./components/Intro";
import Quiz from "./components/Quiz";
import Outro from "./components/Outro";
import Teams from "./components/Teams";
import { useAtom } from "jotai";
import { stageAtom } from "./store/stage";

function App() {
  const [stage] = useAtom(stageAtom);

  let content = <div>Oops, something happened</div>;

  if (stage === "intro") content = <Intro />;
  if (stage === "picker") content = <Teams />;
  if (stage === "quiz") content = <Quiz />;
  if (stage === "outro") content = <Outro />;

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-full">
        <div className="w-full max-w-md py-10">{content}</div>
      </div>
    </div>
  );
}

export default App;
