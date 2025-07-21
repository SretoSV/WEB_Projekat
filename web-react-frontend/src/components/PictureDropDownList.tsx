import styles from '../styles/NavigationStyles/PictureDropDownListStyle.module.css';
import { useEffect, useRef, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { DropDownListCard } from './DropDownListCard';
import placeHolder from '../images/placeHolder.png';

export function PictureDropDownList(){
    const { user } = useUserContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as HTMLDivElement)) {
                setIsDropdownOpen(false);
            }
        };
    
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.mainDiv}>
            <div ref={dropdownRef}>
                <img
                    className={styles.profileImage}
                    src={user?.profileImage ? `data:image/png;base64,${user.profileImage}` : placeHolder}
                    alt="ProfilePicture"
                    onClick={toggleDropdown}
                />    
            
            {isDropdownOpen && <DropDownListCard />}
            </div>
            <div className={styles.nameDiv}>{user?.username}</div>
            
        </div>
    );
}