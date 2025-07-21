import logoImage from '../images/logo.png';
import styles from '../styles/NavigationStyles/NavigationStyle.module.css';
import { useUserContext } from '../context/UserContext';
import { motion } from "framer-motion";
import { PictureDropDownList } from './PictureDropDownList';

export function Navigation(){
    const { user } = useUserContext();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut"}}
        >
        <header className={styles.headerDiv}>
            <img 
                src={logoImage}
                alt="Logo"
                className={styles.logoImage}
            />

            <div className={styles.profileDiv}>
                <PictureDropDownList />
            </div>
            
        </header>

        <div className={styles.LinksDiv}>
            {
                user && user.isAdmin ? 
                <>
                <a className={`${styles.Links} ${styles.LinksBorder}`} href="../AdminAllQuizzes">All quizzes</a>
                <a className={`${styles.Links} ${styles.LinksBorder}`} href="../AdminUsersResults">Users results</a>
                </>
                :
                <>
                <a className={`${styles.Links} ${styles.LinksBorder}`} href="../UserAllQuizzes">All quizzes</a>
                <a className={`${styles.Links} ${styles.LinksBorder}`} href="../AllResults">All results</a>
                <a className={`${styles.Links} ${styles.LinksBorder}`} href="../GlobalRanglist">Global ranglist</a>
                </>
            } 
        </div>
        
        </motion.div>
    );
}