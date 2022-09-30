import { useEffect } from "react";
import Intro from "./components/Intro";
import Quiz from "./components/Quiz";
import Outro from "./components/Outro";
import Teams from "./components/Teams";
import { getQuestions } from "./models/questions.model";
import { useAtom } from "jotai";
import { questionsAtom } from "./store/questions";
import { stageAtom } from "./store/stage";

function App() {
  const [stage] = useAtom(stageAtom);
  const [questions, setQuestions] = useAtom(questionsAtom);

  useEffect(() => {
    console.log(questions);
    if (!questions.length) {
      getQuestions().then(({ data }) => {
        setQuestions((data || []).map((q) => ({ ...q, answered: false })));
      });
    }
  });

  let content = <div>Oops, something happened</div>;

  if (stage === "intro") content = <Intro />;
  if (stage === "picker") content = <Teams />;
  if (stage === "quiz") content = <Quiz />;
  if (stage === "outro") content = <Outro />;

  return (
    <div className="hero h-screen bg-base-200">
      <div className="hero-content w-full">
        <div className="w-full max-w-md">{content}</div>
      </div>
    </div>
  );
}

export default App;
