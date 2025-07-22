import styles from '../styles/ButtonsStyles/ButtonWithImageStyle.module.css';

interface ButtonWithImageProps{
    image: string,
    onClick?: () => void,
    onClick1?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    alt: string,
    title: string,
    widthImage: string,
    heightImage: string,
    type?: "button" | "submit" | "reset";
}
export default function ButtonWithImage(props: ButtonWithImageProps){
    return <button className={styles.button} onClick={props.onClick || props.onClick1} type={props.type}>
        <img 
            src={props.image}
            alt={props.alt}
            title={props.alt}
            style={{width:`${props.widthImage}`, height:`${props.heightImage}`}}
        />
    </button>
}