import * as signalR from "@microsoft/signalr";
import { serverPath } from "../serverPath";

let token: string | null = localStorage.getItem("token");
let refreshToken: string | null = localStorage.getItem("refreshToken");

async function getAccessToken(): Promise<string> {
    if (token && !isTokenExpired(token)) {
        return token;
    }

    if (refreshToken) {
        const refreshResponse = await fetch(`${serverPath()}/api/users/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshTokenHash: refreshToken })
        });

        if (!refreshResponse.ok) {
            console.error("Refresh token expired!");
            localStorage.clear();
            window.location.href = "../login";
            return "";
        }

        const data = await refreshResponse.json();
        token = data.accessToken;
        localStorage.setItem("token", token ?? "");

        return token ?? "";
    }

    return "";
}

function isTokenExpired(jwtToken: string): boolean {
    try {
        const payload = JSON.parse(atob(jwtToken.split(".")[1])); //uzmem sredisnji deo tokena-> payload gde imam {"sub", "name", "exp"}
        const exp = payload.exp * 1000;
        return Date.now() >= exp;
    } catch {
        return true;
    }
}

const socket = new signalR.HubConnectionBuilder()
    .withUrl(`${serverPath()}/signalrhub`, {
        accessTokenFactory: async () => await getAccessToken()
    })
    .withAutomaticReconnect()
    .build();

export default socket;
