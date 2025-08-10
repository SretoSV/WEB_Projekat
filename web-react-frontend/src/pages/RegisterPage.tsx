import { useEffect } from "react";
import { RegisterForm } from "../components/RegisterForm";
import { useQuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";

export function RegisterPage(){
    const navigate = useNavigate();
    const { quizResult } = useQuizContext();

    useEffect(() => {
        if (quizResult) {
            navigate(`/StartQuizPage/${quizResult.quizId}`, { replace: true });
        }
    }, [quizResult]);

    return <div>
        <RegisterForm />
    </div>
}