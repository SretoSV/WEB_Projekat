import styles from '../styles/ButtonsStyles/ButtonWithTextStyle.module.css';
interface ButtonWithLongTextProps{
    onClick?: () => void,
    onClick1?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    text: string,
    type?: "button" | "submit" | "reset";
}

export default function ButtonWithLongText(props: ButtonWithLongTextProps){
    return <button className={styles.buttonLong} onClick={props.onClick || props.onClick1} type={props.type}>
        {props.text}
    </button>
}