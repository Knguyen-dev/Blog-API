const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {DateTime} = require("luxon");
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
    - Storing refrehs tokens in the database allows hte server to revoke or 
      invalidate tokens before their natural expiration time. Useful in scenarios 
      where the user wants to logout or delete their account.
    
    */
    refreshToken: {
      type: String,
      default: "",
    }
	},
	{
		toJSON: { virtuals: true },
		timestamps: true,
	}
);


/*
+ Sign up method: Saves user itno the database.
- NOTE: Assumes all data has been validated. This also includes
  checking if the username is unique.

*/
userSchema.statics.signup = async function (
	email,
	username,
	password,
	fullName
) {

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	// Save user to database 
	await this.create({
		email,
		username,
		password: hash,
		fullName
	});

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
- Static method for finding a user. It handles checking whether the ID is valid,
  the selection of fields, and the sending of errors if the user wasn't found. 
  Finally it returns the user.

- NOTE: 
  1. Main benefit of this is now we can reduce a lot of repetition that 
  we'd normally face when doing things such as verifynig whether the id is valid, 
  querying the database via id, and then checking if the database found anything.

  2. If selectOptions is null, mongoose will include all fields.
*/
userSchema.statics.findUserByID = async function(userID, selectOptions = null) {

  // Check if the document ID provided is valid
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    const err = Error("Invalid user ID!")
    err.statusCode = 400
    throw err;
  }

  // Query database for user
  
  let user = await this.findById(userID).select(selectOptions);

  // If no user was found with that ID
  if (!user) {
    const err = Error("User not found!")
    err.statusCode = 400
    throw err;
  }

  // Return the user model instance
  return user;
}

userSchema.virtual("formatted_creation_date").get(function() {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED)
})


module.exports = mongoose.model("User", userSchema);
