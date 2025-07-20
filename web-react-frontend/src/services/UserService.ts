import type { User } from "../models/UserModel";
import { serverPath } from "../serverPath";

export interface LoginResponse {
    userData: User;
    userToken: string;
}

export async function loginUser(loginForm: { email: string; password: string }): Promise<LoginResponse> {
    try {
    const response = await fetch(`${serverPath()}/api/User/login`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
    }

    const userData: User = {
        username: data.username,
        email: data.email,
        profileImage: data.profileImage,
        isAdmin: data.isAdmin
    };

    return {
        userData,
        userToken: data.token
    };
    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }
}
