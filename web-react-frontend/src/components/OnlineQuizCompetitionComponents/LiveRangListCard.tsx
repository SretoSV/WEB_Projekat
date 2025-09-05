import type { LiveRangList } from "../../models/LiveRangListModel";

interface LiveRangListCardProps{
    liveRangList: LiveRangList | null;
}
export function LiveRangListCard({ liveRangList }: LiveRangListCardProps){
     console.log("LiveRangListCard props:", liveRangList);
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