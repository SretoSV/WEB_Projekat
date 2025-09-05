export interface LiveRangList {
  id: number;
  gameRoomId: number;
  liveRangListParticipants: Array<LiveRangListParticipant>;
}

export interface LiveRangListParticipant {
  id: number;
  liveRangListId: number;
  userId: number;
  points: number;
}
