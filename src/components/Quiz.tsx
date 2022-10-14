import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAnswer } from "../models/answers.model";
import { getQuestions } from "../models/questions.model";
import { teamAtom } from "../store/team";
import { timerAtom, TIMER_TIME } from "../store/timer";
import { currentQuestionAtom, questionsAtom } from "../store/questions";
import { stageAtom } from "../store/stage";
import { markTeamFinished } from "../models/teams.model";
import { useEffect } from "react";
import Loading from "./Loading";
import useCountDown from "../hooks/useCountdown";

function Quiz() {
  const [questions, setQuestions] = useAtom(questionsAtom);
  const [, setStage] = useAtom(stageAtom);
  const [team] = useAtom(teamAtom);
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const [timer, setTimer] = useAtom(timerAtom);

  const { actions, timeLeft } = useCountDown(timer);

  useEffect(() => {
    setTimer(timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    getQuestions(team!.id).then(({ data }) => {
      if (!data || !data.length) return setStage("outro");
      setQuestions(data);
    });
    actions.start();
  }, []);

  const FormSchema = z.object({
    answer: z.string().min(1, { message: "Рекомендую спробувати, все таки" }),
  });

  type FormData = z.infer<typeof FormSchema>;

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setFocus,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const handleQuestionAnser = handleSubmit(({ answer }) => {
    createAnswer({
      question_id: questions[currentQuestion].id,
      team_id: team!.id,
      text: answer,
    })
      .then(() => {
        if (questions.length === currentQuestion + 1) {
          setStage("outro");
          markTeamFinished(team!.id);
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
      <div className="fixed top-0 left-0 right-0">
        <div
          style={{ width: `${(timer / TIMER_TIME) * 100}%` }}
          className={`h-1 bg-green-700`}
        ></div>
        <div className="p-2 font-semibold">
          {Math.floor(timeLeft / 1000 / 60)}:
          {String(
            timeLeft / 1000 - Math.floor(timeLeft / 1000 / 60) * 60
          ).padStart(2, "0")}
        </div>
      </div>
      {questions.length ? (
        <>
          <h1 className="text-4xl font-bold p-2">
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
              {...register("answer")}
            />
            {errors.answer && (
              <span className="italic">{errors.answer.message}</span>
            )}
            <button className="btn btn-primary" onClick={handleQuestionAnser}>
              <span className="mr-2">Продовжити</span>{" "}
              <ChevronRightIcon width={20} />
            </button>
          </form>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Quiz;
