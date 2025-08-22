import type { RoomParticipant } from "./RoomParticipantModel";

export interface GameRoom {
  id: number;
  quizID: number;
  numberOfUsers: number;
  isStarted: boolean;
  isFinished: boolean;
  roomParticipants?: Array<RoomParticipant>;
}
