import mongoose from "mongoose";
import {roles_map} from "../config/roles_map";
import { IUser, IUserModel } from "../types/User";
import { createError } from "../middleware/errorUtils";
import { 
  generatePasswordResetToken, 
  generatePasswordResetTokenHash,
  generateVerifyEmailToken, 
  generateVerifyEmailTokenHash,
} from "../middleware/tokenUtils";
import { generateVerifyEmailUrl } from "../middleware/passwordUtils";
import sendVerifyEmail from "../services/email/sendVerifyEmail";

const userSchema = new mongoose.Schema<IUser, IUserModel>(
	{
    /**
     * Email of the user. This should be unique, meaning a given email can only be associated 
     * with one user.
     */
		email: {
			type: String,
			required: true,
			lowercase: true,
			maxLength: 64,
      unique: true
		},
    /**
     * Username of the user. A given username can only be associated with one user. In our validation
     * we will also lowercase them and check for uniqueness.
     * 
     * For example, "MyUser123" and 'myuser123' will be the same username
     */
		username: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
      minLength: 6,
			maxLength: 32,
		},

    /**
     * The first time the user has changed their username, within a defined period, e.g. a 7 day
     * period.
     * 
     */
    initialUsernameChangeDate: {
      type: Date,
      default: Date.now(),
    },

    /**
     * The number of times the user has changed their username within a defined period, e.g.
     * a 7 day period.
     */
    usernameChangeCount: {
      type: Number,
      default: 0,
    },

    // The hashed version of the user's plaintext password
		password: {
			type: String,
			required: true,
		},

    // The full name of the user
    fullName: {
      type: String,
      required: true,
      maxLength: 64
    },

    // The role of the user; by default when a user registers, they are given the 'user' role.
    role: {
      type: Number,
      default: roles_map.user
    },
    
    // Date at which the last time the user has logged into their account
    lastLogin: {
      type: Date
    },

    /**
     * The refresh jwt token associated with their account. This is used for refreshing a user's access token
     * and also storing refresh tokens in the database allow us to revoke them.
     */
    refreshToken: String,

    // User's profile picture
    avatar: String,

    /**
     * Boolean indicating whether or not the email associated with the user's account has been confirmed/verified.
     * 
     * NOTE: By default this is false because when a user signs up and logs in their email won't be verified yet.
     */
    isVerified: {
      type: Boolean,
      default: false
    },

    /**
     * Token hash, used to verify a user's email.
     * 
     * NOTE: The token hash is stored in the database, whilst the unhashed token is used to generate an 
     * email verification url, and sent to the user via their email.
     */
    verifyEmailToken: String,

    // Date at which the email verification token is no longer valid
    verifyEmailTokenExpires: Date,

    /**
     * Field representing the email that's being verified when a email verification token is active and the 
     * verification link has been sent to the user 
     * 
     * Then the user will hit the email verification reset endpoint with the link we sent them, and we'll 
     * see if when we hash the unhashed token, if it will match the token hash in the database.
     */
    emailToVerify: String,

    /**
     * Token hash for resetting a user's password. The token hash is stored in the database, whlist the 
     * unhashed password reset token is used to create a password reset link that we will send to the user.
     * 
     * Then the user will hit the password reset endpoint when they click on the link, and we'll 
     * see if when we hash the unhashed token, if it will match the token hash in the database.
     */
    passwordResetToken: String,

    /**
     * Date at which the password reset token is no longer valid
     */
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
  
  // If username hasn't changed, stop execution early.
  if (this.username === username) {
    return;
  }

  // Username is different, so check if another user already has this username (checking availability)
  // If another user exists, then the username isn't available
  const existingUser = await User.findOne({
    username: username
  })
  if (existingUser) {
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
  const resetToken = generatePasswordResetToken();
  const resetTokenHash = generatePasswordResetTokenHash(resetToken);
  this.passwordResetToken = resetTokenHash;
  this.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
}

/**
 * Handles creating a new email verification token and storing its hash AND expiration in the database. Then it returns the plain-text email
 * verification token.
 * 
 * NOTE: By being able to simply overwrite the verifyEmailToken and verifyEmailTokenExpires fields, it makes it pretty 
 * easy to invalidate any previous tokens with the new one. 
 */
userSchema.methods.createVerifyEmailToken = function() {
  const token = generateVerifyEmailToken();
  const tokenHash = generateVerifyEmailTokenHash(token);

  this.verifyEmailToken = tokenHash; // store the token hash
  this.verifyEmailTokenExpires = Date.now() + 15 * 60 * 1000; // token is valid for 15 minutes after creation

  // return plain-text email verification token 
  return token;
}

/**
 * Handles the entire email verification process for a givne user
 * 
 * @param emailToVerify - Email that we want to verify works
 */
userSchema.methods.sendEmailVerification = async function (emailToVerify: string) {

  // Create new email verification token for the user and update the email we want to verify
  const verifyEmailToken = this.createVerifyEmailToken();
  this.emailToVerify = emailToVerify;
  await this.save();

  // Create the link that the user will click to verify their email (using the plain-text email verification token), and attempt to send an email to the user
  const verifyEmailUrl = generateVerifyEmailUrl(verifyEmailToken);
  try {
    await sendVerifyEmail(this.username, emailToVerify, this.fullName, verifyEmailUrl);
  } catch (err) {
    /*
    - If email sending process failed, clear the email verification token from the user, and also the email being verified.
      This ensures that the email verification token won't be used and is invalidate, and it helps us accurately keep track
      of who is verifying their emails and whatnot.
    */
    this.verifyEmailToken = undefined;
    this.verifyEmailTokenExpires = undefined;
    this.emailToVerify = undefined;
    await this.save();
    throw err; // throw err so that it can be propagated up to route handlers and stop our request/response cycle
  }
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