import { useParams } from "react-router-dom";
import { useQuizContext } from "../../context/QuizContext";

export function StartQuizPage() {
    const { quizId } = useParams();
    const { quizzes } = useQuizContext();

    return (
        <>
            Starts {quizId}
        </>
    );
}