import type { UserQuizResult } from "../../models/UserQuizResultModel";
import styles from "../../styles/AllQuizzesPagesStyles/ChartStyle.module.css";
interface ChartProps{
    results: Array<UserQuizResult>;
}
export function Chart({results}: ChartProps){

    return <>
        <div>
            <div className={styles.stubDiv}>
                <div className={styles.percentage} >Percentage(%)</div>
                <div className={styles.verticalLine}></div>

                {
                    results.map((result, index) => (
                        <div 
                            key={result.id} 
                            style={{
                                position: "relative",
                                backgroundColor: index % 2 === 0 ? "#1D7496" : "#125169", 
                                height: `${result.scorePercentage ? (result.scorePercentage * 10/2) : 0}px`, 
                                width:"16px", 
                                marginLeft:"10px"
                            }}
                        >
                        <div 
                            style={{            
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -100%)",
                                fontSize: "13px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center"
                            }}
                            >
                                {result.scorePercentage}<br/>%
                            </div>
                        </div>
                    ))
                }

            </div>
            <div className={styles.horizontalLine}></div>
        </div>
        <div className={styles.attempt}>Attempt</div>
    </>
}