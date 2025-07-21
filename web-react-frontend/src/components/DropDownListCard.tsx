import styles from '../styles/NavigationStyles/PictureDropDownListStyle.module.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

export function DropDownListCard(){
    const navigate = useNavigate();
    const { user, logout } = useUserContext();

    const handleLogout = async () => {
        console.log("Logout");
        logout();
        navigate("/Login");
    };

    return(
        <>
            <div className={styles.dropdownStyle}>
                <div className={styles.triangleDivOuter}></div>
                { user && !user.isAdmin &&
                <div className={styles.dropDownDivs}>
                    <a className={styles.dropDownLinks} href="../UserQuizResults">Your results</a>
                </div>
                }   
                <br />
                <div className={user && !user.isAdmin ? styles.dropDownDivs : styles.dropDownDivsAdmin}>
                    <a
                        className={styles.dropDownLinks}
                        href="/LoginPage"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}
                    >
                        Logout
                    </a>
                </div>
            </div>
        </>
    );
}