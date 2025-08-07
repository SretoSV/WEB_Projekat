export interface User {
    username: string; 
    email: string;
    profileImage?: string;
    isAdmin: boolean;
}

export interface UserDto {
    id: number;
    username: string; 
    profileImage: string;
}
