import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAnswer } from "../models/answers.model";
import { getQuestions } from "../models/questions.model";
import { teamAtom } from "../store/team";
import { currentQuestionAtom, questionsAtom } from "../store/questions";
import { stageAtom } from "../store/stage";
import { markTeamFinished } from "../models/teams.model";
import { useEffect } from "react";
import Loading from "./Loading";

function Quiz() {
  const [questions, setQuestions] = useAtom(questionsAtom);
  const [, setStage] = useAtom(stageAtom);
  const [team] = useAtom(teamAtom);
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);

  useEffect(() => {
    getQuestions(team!.id).then(({ data }) => {
      if (!data || !data.length) return setStage("outro");
      setQuestions(data);
    });
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
