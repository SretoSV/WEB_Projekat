import { useEffect } from "react";
import { LoginForm } from "../components/LoginForm";
import { useUserContext } from "../context/UserContext";

export function LoginPage(){
    const { setUser } = useUserContext();

    useEffect(() => {
        if(!localStorage.getItem('user')){
            setUser(null);
        }
    }, []);

    return <>
        <LoginForm />
    </>
}