const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {DateTime} = require("luxon");
const roles_list = require("../config/roles_list");
const queryUtils = require("../middleware/queryUtils");
const ValidationError = require("../errors/ValidationError");


const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			lowercase: true,
			maxLength: 64,
		},

		username: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
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
      default: roles_list.user
    },

    
    /*
    - Whether the user is an employee or not. People with role of 
      editor and admins must have 'isEmployee' set as true. However 
      if the account has role = user, and they're an employee, that 
      wouldn't give them any extra privileges. IsEmployee is just an 
      indicator so that we can track employee accounts.
    */
    isEmployee: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date
    },


    /*
    - Storing refresh tokens in the database allows hte server to revoke or 
      invalidate tokens before their natural expiration time. Useful in scenarios 
      where the user wants to logout or delete their account.
    */
    refreshToken: {
      type: String,
      default: "",
    },

    // User's profile picture
    avatar: String,
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

/*
+ Update Username method: Handles the updating of the username. In our application we 
  allow the user to update <USERNAME_CHANGE_LIMIT> times every
  limitPeriod.
*/
userSchema.methods.updateUsername = async function (username) {
  /*
  - If the new username is the same as their current one, just end
    the function early. 

  - NOTE: This avoids us counting the them entering the same username as 
    a username chang, and avoids the sitaution where 'isUsernameAvailable'
    finds their own account and flags it as 'Username is already taken'.

  */
  if (this.username === username) {
    return;
  }

  // Check availability of username.
  const isAvailable = await this.constructor.isUsernameAvailable(username);
  if (!isAvailable) {
    const err = new ValidationError("username", `Username '${username}' is already taken!`, 400)
    throw err;
  }

  /*
  - limitPeriod: Time span spanning for 1 week, starting when the 
    user initially changes their username. 

  - USERNAME_CHANGE_LIMIT: Number of times the user can change their username within
    the limitPeriod. If the limit is reached, we'll stop it early and tell the user 
    they can't change their username since they reached their limit for the current period.
  */
  const now = DateTime.utc();
  const limitPeriod = now.minus({weeks: 1});

  const USERNAME_CHANGE_LIMIT = 2;

  /*
  - Conditionals:
  1. If limitPeriod is earlier than initialUsernameChangeDate, then
    they're attempting to change their username but the limit period is over.
    So reset and start a new period where username limit applies.
  
  2. Else if, username change is within the limitPeriod and they're
    still below the limit. Just increment the change count and allow them
    to change their username.

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
    const err = new ValidationError("username", `Username change limit reached! Can only change username twice every 7 days.`, 400);
    throw err;
  }
  
  // Save username 
  this.username = username;
  await this.save();
}




/*
+ Sign up method: Saves user into the database.
- NOTE: 
  1. Assumes all data has been validated. This also includes
    checking if the username is unique.

  2. You might be wondering why we're throwing errors with status codes.
    We'll since we can't access the 'res' object here, we've set it up so 
    that we'll throw errors that are going to be caught by asyncHandler. Then
    those errors are going to be sent back as json in {message: "some error message"}
    form. So whenever we can't access our res object, we can do this instead.
*/
userSchema.statics.signup = async function (
	email,
	username,
	password,
	fullName,
  role = roles_list.user,
  isEmployee = false
) {

  // Check if an existing user exists with that username already
  const isAvailable = await this.isUsernameAvailable(username);
  if (!isAvailable) {
    const err = new ValidationError("username", "Username already taken!", 400);
    throw err;
  }

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	// Save user to database 
	const user = await this.create({
		email,
		username,
		password: hash,
		fullName,
    role,
    isEmployee
	});

  // Return the user
  return user;
};

userSchema.statics.login = async function (username, password) {
	const user = await this.findOne({ username });

  /*
  - For security purposes we can't really specify that this a problem with the 
    username or password, so we just list the field as 'credentials'. This way we 
    can still mark this as a database validation error.
  */
  const err = new Error("Incorrect username or password!");
  err.statusCode = 400;
  
	if (!user) {
		throw err;
	}

	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		throw err;
	}

  // Set the 'lastLogin' to now in UTC time. Changes to user will finally be 
  // saved in the login route handler
  user.lastLogin = DateTime.utc();

	return user;
};

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

// Static method for finding a user
userSchema.statics.findUserByID = queryUtils.findDocumentByID;




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
  delete userObj.createdAt;
  delete userObj.updatedAt;
  return userObj;
}


module.exports = mongoose.model("User", userSchema);
