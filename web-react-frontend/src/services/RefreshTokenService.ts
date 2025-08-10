import { serverPath } from "../serverPath";

export async function authFetch(url: string, options: RequestInit = {}) {
    let token = localStorage.getItem("token");

    const doFetch = async (t: string) => {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Content-Type": "application/json",
                "Authorization": `Bearer ${t}`
            }
        });
    };

    let response = await doFetch(token!);

    if (response.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");

        const refreshResponse = await fetch(`${serverPath()}/api/users/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshTokenHash: refreshToken })
        });

        if (!refreshResponse.ok) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            alert("Authentication failed, please login again.");
            return response;
        }

        const data = await refreshResponse.json();
        localStorage.setItem("token", data.accessToken);

        response = await doFetch(data.accessToken);
    }

    return response;
}