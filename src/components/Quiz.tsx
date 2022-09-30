import { Question } from "../models/questions.model";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import { createAnswer } from "../models/answers.model";
import { useAtom } from "jotai";
import { teamIdAtom } from "../store/team";
import { currentQuestionAtom, questionsAtom } from "../store/questions";
import { stageAtom } from "../store/stage";
import { markTeamFinished } from "../models/teams.model";

const markQuestionAnswered = (
  questions: (Question & { answered: boolean })[],
  question: Question & { answered: boolean }
) => {
  return questions.map((q) => ({
    ...q,
    answered: q.id === question.id ? true : q.answered,
  }));
};

function Quiz() {
  const [questions, setQuestions] = useAtom(questionsAtom);
  const [, setStage] = useAtom(stageAtom);
  const [teamId] = useAtom(teamIdAtom);
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setFocus,
  } = useForm<{ answer: string }>();

  const handleQuestionAnser = handleSubmit(({ answer }) => {
    createAnswer({
      question_id: questions[currentQuestion].id,
      team_id: teamId!,
      text: answer,
    })
      .then(() => {
        setQuestions(
          markQuestionAnswered(questions, questions[currentQuestion])
        );
        if (questions.length === currentQuestion + 1) {
          setStage("outro");
          markTeamFinished(teamId!);
          return;
        }
        setCurrentQuestion((current) => current + 1);
        reset();
        setFocus("answer");
      })
      .catch((error) => {
        alert("error: " + error.message);
      });
  });

  return (
    <div>
      {questions.length ? (
        <>
          <h1 className="text-xl font-bold p-2">
            {questions[currentQuestion].text}
          </h1>
          <form
            className="form-control mt-2 gap-4"
            onSubmit={handleQuestionAnser}
          >
            <input
              type="text"
              placeholder="Дайте відповідь тут"
              className={`input input-bordered w-full ${
                errors.answer && "input-error"
              }`}
              {...register("answer", { required: true, minLength: 3 })}
            />
            <button className="btn btn-primary" onClick={handleQuestionAnser}>
              <span className="mr-2">Продовжити</span>{" "}
              <ChevronRightIcon width={20} />
            </button>
          </form>
        </>
      ) : (
        "loading"
      )}
    </div>
  );
}

export default Quiz;
