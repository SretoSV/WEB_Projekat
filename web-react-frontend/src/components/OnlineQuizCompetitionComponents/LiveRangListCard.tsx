import { useOnlineQuizContext } from "../../context/OnlineQuizContext";
import { useUserContext } from "../../context/UserContext";
import { useLiveRangList } from "../../customHooks/useLiveRangList";
import styles from "../../styles/GlobalRanglistStyles/GlobalRanglistStyle.module.css";
import placeHolder from '../../images/placeHolder.png';

export function LiveRangListCard(){
    const { handleLogout } = useUserContext();
    const { liveRangList } = useOnlineQuizContext();
    const { data, isLoading } = useLiveRangList(liveRangList?.id || 0, handleLogout);
    const profiles = data?.profiles ?? [];

    return <>
        {
            isLoading ? 
            <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Points</th>
                        </tr>
                    </thead>
            </table>
            :
            <div>
                {
                    <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {   
                            liveRangList?.liveRangListParticipants.map((participant, index) => {
                                const user = profiles.find(p => p.id === participant.userId);
                                return <tr key={participant.id}>
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
                                        {participant.points}
                                    </td>
                                </tr>
                            })

                        }
                    </tbody>
                </table>

                }
            </div>
        }
    </>
}
