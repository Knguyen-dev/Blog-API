import { IUser } from "./Post";

export interface AuthState {
	user: IUser | null;
	accessToken: string | null;
}

export interface ISignupFormData {
	email: string;
	username: string;
	fullName: string;
	password: string;
	confirmPassword: string;
}

export interface ILoginFormData {
	username: string;
	password: string;
}

export interface IChangePasswordFormData {
	oldPassword: string;
	password: string;
	confirmPassword: string;
}

export interface IDeleteAccountFormData {
	password: string;
	confirmPassword: string;
}

export interface IChangeEmailFormData {
	email: string;
}

export interface IChangeFullNameFormData {
	fullName: string;
}

export interface IChangeUsernameFormData {
	username: string;
}