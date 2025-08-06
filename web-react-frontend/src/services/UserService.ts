import type { User } from "../models/UserModel";
import { serverPath } from "../serverPath";

export interface LoginResponse {
    userData: User;
    userToken: string;
}
export interface RegisterResponse {
    message: string;
}

export async function loginUser(loginForm: { usernameOrEmail: string; password: string }): Promise<LoginResponse> {
    try {
        const response = await fetch(`${serverPath()}/api/users/login`, {
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

export async function registerUser(formData: FormData): Promise<RegisterResponse> {
    try {
    const response = await fetch(`${serverPath()}/api/users/register`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
    }

    return {
        message: data.message
    };
    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }
}


export interface FetchUsersUsernamesResponse {
    allUserUsernames: Array<string>;
}

export async function fetchAllUsers(): Promise<FetchUsersUsernamesResponse> {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${serverPath()}/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status === 204) {
            return { allUserUsernames: [] };
        }
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Fetching failed.');
        }

       return {
            allUserUsernames: data,
        };

    } catch (err: any) {
        throw new Error(err.message || 'Server error. Try again later.');
    }

}


export function validateAndExtractImageFile(file: File | null): { valid: boolean; error?: string; file?: File; fileName?: string } {
    if (!file) {
        return { valid: false, error: "No file selected." };
    }

    if (!file.type.startsWith("image/")) {
        return { valid: false, error: "Only images are allowed to be uploaded." };
    }

    return {
        valid: true,
        file,
        fileName: file.name
    };
}
