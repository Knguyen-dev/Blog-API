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
  isEmployee: boolean;

  // These properties could be could be undefined, so they may not even be in the BSON object
  lastLogin?: Date;
  refreshToken?: string;
  avatar?: string;

  // Properties created by timestamp configuration
  createdAt: Date;
  updatedAt: Date;
}

// The UserDoc, but it also contains virtuals and instance methods; teh representation of what's going to be returned from mongoose
export interface IUserDoc extends IUser, Document {
  avatarSrc: string;
  avatarInitials: string;
  updateUsername(username: string): Promise<void>;
  toJSON(): any;
}

// The model which contains the static methods of the model
export interface IUserModel extends Model<IUserDoc> {
  isUsernameAvailable(username: string): Promise<boolean>;
}
