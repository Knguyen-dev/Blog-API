/* eslint-disable no-mixed-spaces-and-tabs */
import { IUser } from "./Post";
import authActions from "../constants/authActions";

export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
}

/*
- Define the possible actions in your authentication context.

Each one will calculate the typeof the 'authActions' property, which would 
be string in this case. And then for some of them we define the structure of 
the payload.

- NOTE: We use 'never' for the pyaload to indicate that this means this action
  should not have any payload associated with it, hence undefined or never.
*/

export type AuthActionType =
  | {
      type: typeof authActions.login;
      payload: {
        user: IUser;
        accessToken: string;
      };
    }
  | { type: typeof authActions.logout; payload?: never }
  | { type: typeof authActions.updateUser; payload: IUser };

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

export type RoleKey = "user" | "editor" | "admin";

export interface IForgotPasswordFormData {
  email: string;
}

export interface IResetPasswordFormData {
  password: string;
  confirmPassword: string;
}
