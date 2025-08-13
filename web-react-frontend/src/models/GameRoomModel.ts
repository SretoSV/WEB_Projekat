import type { RoomParticipant } from "./RoomParticipantModel";

export interface GameRoom {
  id: number;
  quizID: number;
  numberOfUsers: number;
  isFinished: boolean;
  roomParticipants?: Array<RoomParticipant>;
}
