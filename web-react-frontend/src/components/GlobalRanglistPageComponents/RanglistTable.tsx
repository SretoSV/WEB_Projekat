import type { UserDto } from "../../models/UserModel";
import type { UserQuizResult } from "../../models/UserQuizResultModel";
import styles from "../../styles/GlobalRanglistStyles/GlobalRanglistStyle.module.css";
import placeHolder from '../../images/placeHolder.png';

interface RanglistTableProps{
    selectedQuizId: number;
    results: Array<UserQuizResult>;
    profiles: Array<UserDto>;
}

export function RanglistTable({selectedQuizId, results, profiles}: RanglistTableProps){
    return  <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Points</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        selectedQuizId > 0 && results.map((result, index) => {
                            const duration = result.submittedAt 
                            ? new Date(result.submittedAt + "Z").getTime() - new Date(result.startedAt + "Z").getTime() 
                            : null;

                            const minutes = duration ? Math.floor(duration / 60000) : 0;
                            const seconds = duration ? Math.floor((duration % 60000) / 1000) : 0;
                            const user = profiles.find(p => p.id === result.userId);
                            return <tr key={result.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className={styles.profileDiv}>
                                        <img
                                            src={user?.profileImage ? `data:image/png;base64,${user.profileImage}` : placeHolder}
                                            className={styles.profileImage}
                                            alt="profile"
                                        />
                                        <div>{user?.username}</div>
                                    </div>
                                </td>
                                <td>
                                    {result.correctAnswers + "/" + result.totalQuestions}
                                </td>
                                <td>
                                    {duration !== null ?
                                        minutes === 0 ? 
                                        `${seconds} sec`
                                        :
                                        `${minutes} min ${seconds} sec`
                                    :
                                        "Not submitted"
                                    }
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
}