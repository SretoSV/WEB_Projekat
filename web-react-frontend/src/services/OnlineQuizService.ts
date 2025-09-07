import type { GameRoom } from "../models/GameRoomModel";
import type { LiveRangList } from "../models/LiveRangListModel";
import type { UserDto } from "../models/UserModel";
import { serverPath } from "../serverPath";
import { authFetch } from "./RefreshTokenService";

export interface FetchGameRoomsResponse {
    fetchedGameRooms: Array<GameRoom>;
}
export async function fetchGameRooms(onLogout: () => void): Promise<FetchGameRoomsResponse> {
    const res = await authFetch(`${serverPath()}/api/rooms`, { method: "GET" }, onLogout);
    if (res.status === 204) return { fetchedGameRooms: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Fetching failed.");
    return { fetchedGameRooms: data };
}

export interface AddGameRoomResponse {
    addedGameRoom: GameRoom;
}
export async function addGameRoom(gameRoom: GameRoom, onLogout: () => void): Promise<AddGameRoomResponse> {
    const res = await authFetch(`${serverPath()}/api/rooms`, { method: "POST", body: JSON.stringify(gameRoom) }, onLogout);
    if (!res.ok) throw new Error(await res.text() || "Failed to add game room");
    return { addedGameRoom: await res.json() };
}

export interface GetLiveRangListResponse {
    fetchedLiveRangList: LiveRangList;
}
export async function fetchLiveRangList(gameRoomId: number, onLogout: () => void): Promise<GetLiveRangListResponse> {
    const res = await authFetch(`${serverPath()}/api/rooms/${gameRoomId}`, { method: "GET" }, onLogout);
    if (!res.ok) throw new Error(await res.text() || "Failed to get live rang list");
    return { fetchedLiveRangList: await res.json() };
}

export interface FetchQuizResultsByQuizIdResponse {
    profiles: Array<UserDto>;
}
export async function fetchProfilesForLiveRangList(rangListId: number, onLogout: () => void): Promise<FetchQuizResultsByQuizIdResponse> {
    const res = await authFetch(`${serverPath()}/api/rooms/profiles/${rangListId}`, { method: "GET" }, onLogout);
    if (res.status === 204) return { profiles: [] };
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Fetching failed.");
    return { profiles: data };
}