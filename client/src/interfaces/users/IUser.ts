export interface IUser {
    id: number;
    name: string;
    email: string;
    role: string;
    last_login_at: string | null;
    account_status: string;
    encounters_count: number;
}

export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
}