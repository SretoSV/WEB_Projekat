import styles from '../styles/ButtonsStyles/ButtonWithTextStyle.module.css';
interface ButtonWithTextProps{
    onClick?: () => void,
    onClick1?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    text: string,
    type?: "button" | "submit" | "reset";
}

export default function ButtonWithText(props: ButtonWithTextProps){
    return <button className={styles.button} onClick={props.onClick || props.onClick1} type={props.type}>
        {props.text}
    </button>
}