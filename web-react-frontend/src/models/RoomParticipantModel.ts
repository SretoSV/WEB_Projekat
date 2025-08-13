import type { UserDto } from "./UserModel";

export interface RoomParticipant {
  id: number;
  gameRoomId: number;
  userId: number;
  userProfile?: UserDto
}
