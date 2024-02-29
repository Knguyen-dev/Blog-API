const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {DateTime} = require("luxon");
const roles_list = require("../config/roles_list");


/*

- We should have limiters on email, username, and fullName so that 
  you can only change them twice a week.





*/

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

    initialUsernameChange: {
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


1. On the first username change, record the time of our initial change.
  Of course increment the count.
2. As long as username count is less than our limit we increment. However, 
  if the elapsed time since our initial change is greater than 7 days, then
  we reset the count, probably to 1 since we want to include the current change.

- NOTE: Why is this good? Well, let's say they changed their name on the 3 weeks apart.
  Well by checking the initial change date, we 
*/


/*
+ Allow users to change their username twice every 7 days.      
  
  
- NOTE: 
1. initialChangeDate: represents the date for their initial/first
  username change in the 7 day time-period where the username limit applies.
  This means the initial username change marks the start of the 7 day time period 
  where they have a maximum amount of username changes allowed. Any changes 
  during that period, as long as they're below the limit, it'll be allowed. 
  Else it won't be allowed because they have reached the maximum amount of 
  changes allowed during the period. 
2. However, if the username is being changed, and the change has been 
  7 days from initialChangeDate, which was the start date of the period, then 
  we should reset the user's limits because now we're starting a new period.

*/
userSchema.methods.handleUpdateUsername = function () {
  const now = new Date();

  // const oneWeekAgo = new Date(now.getTime() - 15 * 1000); // 15 second time period
  // const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const fifteenSecondsAgo = new Date(now.getTime() - 15 * 1000);
  const USERNAME_CHANGE_LIMIT = 2;

  console.log()

  /*
  + Conditionals:
  1. If the username was initially changed over 7 days ago, we can reset the username change count to 1 to
    indicate that this is now their first username change in the 7 day period.
    Here we're upating the initialChangeDate, and starting the 7 day period 
    where their username limit applies.
  2. Else, we're changing usernames within the 7-day period and they haven't reached their limit yet.
     Here we increment the count to record that they changed their username.
  3. Else, the user tried to change ther username, but they have 
     reached their username changing limit. At this point throw an error to 
    be caught in our pre 'save' middleware. We'll need the status 400
    to indicate that it's an error the input the user had.
  */
  if (this.initialChangeDate < fifteenSecondsAgo) {
    this.usernameChangeCount = 1;
    this.initialChangeDate = now;
  } else if (this.usernameChangeCount < USERNAME_CHANGE_LIMIT) {
    this.usernameChangeCount++;
  } else {
    const err = Error(`Username change limit reached!`);
    err.statusCode = 400;
    throw err;
  }
}


// Pre-save middleware
userSchema.pre("save", function (next) { 
  try {
    if (this.isModified("username")) {
      this.handleUpdateUsername();
    }
    next(); // go to next middleware.
  } catch (err) {
    // Throw error up and it should be caught in the try/catch in the route/handlers
    throw err;
  }
})




/*
+ Sign up method: Saves user itno the database.
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
  role = roles_list.user
) {

  // Check if an existing user exists with that username already
  const existingUser = await this.findOne({ username });
  if (existingUser) {
    const error = new Error("Username already taken!");
    error.statusCode = 400;
    throw error;
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
    role
	});

  // Return the user
  return user;
};

userSchema.statics.login = async function (username, password) {
	const user = await this.findOne({ username });

	if (!user) {
		const error = new Error("Incorrect username!");
		error.statusCode = 400;
		throw error;
	}

	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		const error = new Error("Incorrect password!");
		error.statusCode = 400;
		throw error;
	}
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
    return `http://localhost:${process.env.PORT}/images/${this.avatar}`;
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
- Static method for finding a user. It handles checking whether the ID is valid,
  the selection of fields, and the sending of errors if the user wasn't found. 
  Finally it returns the user.

- NOTE: 
  1. Main benefit of this is now we can reduce a lot of repetition that 
  we'd normally face when doing things such as verifynig whether the id is valid, 
  querying the database via id, and then checking if the database found anything.

  2. If selectOptions is null, mongoose will include all fields.

  3. Status code 404 is reserved for bad user id and no user found. Whlist 
    we use status code 400 to indicate that we found invalid input in a user's 
    input data. These status codes sometimes return error objects in different forms,
    and we can predict what kind of error data we'll get on the front end if we follow
    these rules.
*/
userSchema.statics.findUserByID = async function(userID, selectOptions = null) {
  // Check if the document ID provided is valid
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    const err = Error("Invalid user ID!")
    err.statusCode = 404
    throw err;
  }
  let user = await this.findById(userID).select(selectOptions);
  // If no user was found with that ID
  if (!user) {
    const err = Error("User not found!")
    err.statusCode = 404
    throw err;
  }
  return user;
}

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
  delete userObj.initialUsernameChange;
  delete userObj.usernameChangeCount;
  return userObj;
}


module.exports = mongoose.model("User", userSchema);
