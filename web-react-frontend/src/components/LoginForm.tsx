import styles from '../styles/LoginPageStyles/LoginPageStyle.module.css';
import { handleInputChange } from '../functions/formChangeFunction';
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/UserService';

export function LoginForm(){
    const { user, login } = useUserContext();
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const { userData, userToken } = await loginUser(loginForm);
            login(userData, userToken);
        } 
        catch (err: any) {
            alert(`Error from server: ${err.message}`);
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
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="off"
                    onChange={(e) => handleInputChange(e, setLoginForm)}
                    placeholder='email'
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="off"
                    placeholder='password'
                    onChange={(e) => handleInputChange(e, setLoginForm)}
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
        <button className={styles.submitButton}>Login</button>
    </form>
    </>
}