import { useOnlineQuizContext } from "../../context/OnlineQuizContext";

export function LiveRangListCard(){
    const { liveRangList } = useOnlineQuizContext();

    return <>
        LiveRangList
        <div>
            id | liveRangListId | userId | points
            {
                liveRangList?.liveRangListParticipants.map((participant) => {
                    return <div key={participant.id}>
                        {participant.id} | {participant.liveRangListId} | {participant.userId} | {participant.points}
                    </div>
                })
            }
        </div>
    </>
}