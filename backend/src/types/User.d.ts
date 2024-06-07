import { Document, Model } from "mongoose";

export interface IUser {
  // Fields that are saved in the database
  email: string;
  username: string;
  initialUsernameChangeDate: Date;
  usernameChangeCount: number;
  password: string;
  fullName: string;
  role: number;

  // These properties could be could be undefined, so they may not even be in the BSON object
  lastLogin?: Date;
  refreshToken?: string;
  avatar?: string;

  isVerified: boolean;
  verifyEmailToken?: String;
  verifyEmailTokenExpires?: Date;
  emailToVerify?: string;

  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;

  // Properties created by timestamp configuration
  createdAt: Date;
  updatedAt: Date;
}

// The UserDoc, but it also contains virtuals and instance methods; teh representation of what's going to be returned from mongoose
export interface IUserDoc extends IUser, Document {
  avatarSrc: string;
  avatarInitials: string;
  updateUsername(username: string): Promise<void>;
  isEmployee(): boolean;
  createPasswordResetToken(): string;
  createVerifyEmailToken(): string;
  sendEmailVerification(emailToVerify: string): Promise<void>;
  toJSON(): any;
}

// The model which contains the static methods of the model
export interface IUserModel extends Model<IUserDoc> {
  isUsernameAvailable(username: string): Promise<boolean>;
}
