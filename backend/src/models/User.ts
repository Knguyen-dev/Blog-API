import mongoose from "mongoose";
import {roles_map} from "../config/roles_map";
import { IUser, IUserModel } from "../types/User";
import { createError } from "../middleware/errorUtils";
import crypto from "crypto";

const userSchema = new mongoose.Schema<IUser, IUserModel>(
	{
		email: {
			type: String,
			required: true,
			lowercase: true,
			maxLength: 64,
      unique: true
		},
		username: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
      minLength: 6,
			maxLength: 32,
		},
    initialUsernameChangeDate: {
      type: Date,
      default: Date.now(),
    },
    usernameChangeCount: {
      type: Number,
      default: 0,
    },
		password: {
			type: String,
			required: true,
		},
    fullName: {
      type: String,
      required: true,
      maxLength: 64
    },

    /*
    - Roles: One role per user
    1. user: can read data (The default value indicated in our signup function)
    2. editor: Can write and editor posts, probably just their own though.
    3. admin: Can read, edit, and even archive or delete posts.
    */
    role: {
      type: Number,
      default: roles_map.user
    },
    
    lastLogin: {
      type: Date
    },

    /*
    - Storing refresh tokens in the database allows hte server to revoke or 
      invalidate tokens before their natural expiration time. Useful in scenarios 
      where the user wants to logout or delete their account.
    */
    refreshToken: String,

    // User's profile picture
    avatar: String,

    passwordResetToken: String,
    passwordResetTokenExpires: Date,


	},
	{
    /*
    + Now when calling toObject, our virtual properties are retained.
      As a result, we keep our virtual properties when 
      converting to json.
    
    1. toObject: Converts a Mongoose document into a plain JavaScript object.
    2. toJSON: Converts a Mongoose document into a JSON string. You
      may want to override this method like we've done here and directly
      control what we is returned when a document is turned into a json string.

    - Takeaway: So when we do res.json(user), we actually call our userSchema.methods.toJSON() function. 
      In this function we use the important toObject to actually create the javascript object. 
      And then toJSON handles stuff such as deleting certain fields and whatnot. 
      This is all done automatically like we've defined in our code.
    */
		toObject: { virtuals: true },
		timestamps: true,
	}
);

/*
+ Checks if a username is available. If user doesn't exist return true, else return false.
*/
userSchema.statics.isUsernameAvailable = async function (username) {
  const existingUser = await this.findOne({username});
  return !existingUser;
}

/**
 * Checks username, and if successful, updates the username attribute of 
 * the user instance
 * 
 * NOTE: This method doesn't save changes in the database. So after calling this function
 * you'd do myUser.save() ot change those changes in the database. This give flexibility
 * to the function and prevents unnecessary save operations when you're using it in service 
 * functions.
 * 
 * @param username - New username that user wants to change to
 */
userSchema.methods.updateUsername = async function(username: string) {
  // Early return if the username is the same as the current one; we aren't going to use 
  // database resources when it doesn't change the username
  if (this.username === username) {
    return;
  }

  // Username is different, check it's availablility
  // If not available, throw an error to be caught in the route-handler
  const isAvailable = await User.isUsernameAvailable(username);
  if (!isAvailable) {
    throw createError(400, "Username is already taken!");
  };

  /*
  + Idea that user can only change their username two times a week.

  - limitPeriod: Time span spanning for 1 week, starting when the 
    user initially changes their username. So we'll keep track of the 
    date 7 days ago.

  - USERNAME_CHANGE_LIMIT: Number of times the user can change their username within
    the limitPeriod. If the limit is reached, we'll stop it early and tell the user 
    they can't change their username since they reached their limit for the current period.
  */  
  const now = new Date();
  const limitPeriod = new Date(now);
  limitPeriod.setDate(now.getDate() - 7); // 7 days ago from now
  const USERNAME_CHANGE_LIMIT = 2;

  /*
  - Conditionals:
  1. If limitPeriod is earlier than initialUsernameChangeDate, then
    they're attempting to change their username but the limit period is over.
    (The current time that they're changing to change their username is over 7 days ago 
      compared to when they initially changed their name)
    So reset and start a new period where username limit applies.
  
  2. Else if, username change is within the limitPeriod (they're changing their name and it hasn't been 7 days since) 
    and they're still below the limit (still within 7 days from when they initially changed their username). 
    Just increment the change count and allow them to change their username.

  3. Else, still within limit period, and they already reached their 
    limit, so return a 400 error to indicate a 'server-side form validation'
    error which stops function execution early.
  */
  if (limitPeriod > this.initialUsernameChangeDate) {
    this.usernameChangeCount = 1;
    this.initialUsernameChangeDate = now;
  } else if (this.usernameChangeCount < USERNAME_CHANGE_LIMIT) {
    this.usernameChangeCount += 1;
  } else {
    throw createError(400, `Username change limit reached! Can only change username twice every 7 days.`);
  }

  // Update new username; the saving of changes will be handled in the service functions
  this.username = username;
  ;
}

userSchema.methods.isEmployee = function() {
  return this.role === roles_map.editor || this.role === roles_map.admin;
}

/**
 * Creates the password reset token and the token hash. Stores token hash in the database 
 * whilst returning the plain-text token
 * 
 * NOTE: Overwriting the fields like this instead of creating a separate collection also makes it 
 * a lot simpler to invalidate any previous password reset tokens.
 */
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetToken = resetTokenHash;
  this.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
}



/*
+ Returns the url link for getting the avatar. 

- NOTE: Virtual property so it's very flexible. We should only return the 
  string when avatar is defined. Else, return an empty string to indicate 
  that the user doesn't have an image for their avatar yet.
*/
userSchema.virtual("avatarSrc").get(function() {
  if (this.avatar) {
    return `http://localhost:${process.env.PORT}/avatars/${this.avatar}`;
  } else {
    return ""
  }
})

userSchema.virtual("avatarInitials").get(function() {  

  // Split the name into an array based on spaces, which represent sections of the name
  const nameArr = this.fullName.split(" ");
  let initials = ""

  // Get the first letter of the first section of the name, represents our starting initial.
  initials += nameArr[0][0];

  // If they have more than one part to their name, then we can get 
  // a second letter for their initials. We do nameArr.length - 1 to target the last section of 
  // their name. As a result we aim to get their first and last initials.
  if (nameArr.length > 1) {
      initials += nameArr[nameArr.length - 1][0]
  }
  
  // Return the uppercased version of the initials.
  return initials.toUpperCase();   
})

/*
- Situation: When sending back a user as json, we don't want to include fields such as 
  'password' or 'refreshToken', and any critically sensitive data such as that. We want
  a clean way to do this automatically when the User object is converted and sent as JSON.

- Solution: Define a schema.mehods.toJSON. We turn our User model instance into a 
  javascript object. THen we delete some fields we don't want to include. So here we 
  delete password, refreshToken, and the '__v' which has something to do with indexes in
  mongoDB. These info is either critical or irrelevant to the frontend, so we don't need it.
  
*/
userSchema.methods.toJSON = function() {
  const userObj = this.toObject();
  delete userObj.password; // omit sensitive info such as password and refresh token
  delete userObj.refreshToken;
  delete userObj.avatar; // avatar is only used on the backend, avatarSrc will have used in its place on the frontend
  delete userObj.__v; // not needed on frontend
  delete userObj.initialUsernameChangeDate; // The rest of these are just used on the backend
  delete userObj.usernameChangeCount;

  delete userObj.passwordResetToken;
  delete userObj.passwordResetTokenExpires;

  delete userObj.createdAt;
  delete userObj.updatedAt;
  
  return userObj;
}

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;