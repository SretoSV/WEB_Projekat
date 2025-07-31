import styles from '../styles/LoginPageStyles/LoginPageStyle.module.css';
import { handleInputChange } from '../functions/formChangeFunction';
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/UserService';
import ButtonWithText from './ButtonWithText';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../config/constants';

export function LoginForm(){
    const { user, login } = useUserContext();
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({ usernameOrEmail: '', password: '', });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(loginForm.password.length < MIN_PASSWORD_LENGTH || loginForm.password.length > MAX_PASSWORD_LENGTH){
            alert(`Password length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters!`);
        }
        else{
            try {
                const { userData, userToken } = await loginUser(loginForm);
                login(userData, userToken);
            } 
            catch (err: any) {
                alert(`Error from server: ${err.message}`);
            }
        }
    };

    useEffect(() => {
        if(user){
            if(user.isAdmin){
                navigate('/AdminAllQuizzesPage');
            }
            else{
                navigate('/UserAllQuizzesPage');
            }
        }
    }, [user]);

    return <>
    <form className={styles.editForm} onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className={styles.formContent}>
          <div className={styles.formLeft}>
                <label htmlFor="usernameOrEmail">Username or Email</label>
                <input
                    id="usernameOrEmail"
                    type="text"
                    name="usernameOrEmail"
                    autoComplete="off"
                    onChange={(e) => handleInputChange(e, setLoginForm, "string")}
                    placeholder='username or email'
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="off"
                    placeholder='password'
                    onChange={(e) => handleInputChange(e, setLoginForm, "string")}
                    required
                />
          </div>
          <div className={styles.divider}></div>
          <div className={styles.formRight}>
            <div>Don't have an account?</div>
            <a href="/Register" className={styles.registerLink}>
              Register here
            </a>
          </div>
        </div>
        <ButtonWithText text="Login" type="submit" />
        
    </form>
    </>
}