const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

		firstName: {
			type: String,
			required: true,
			maxLength: 50,
		},
		lastName: {
			type: String,
			required: true,
			maxLength: 50,
		},
	},
	{
		toJSON: { virtuals: true },
		timestamps: true,
	}
);

// Static methods for logging in and signing up.
userSchema.statics.signup = async function (
	email,
	username,
	password,
	firstName,
	lastName
) {
	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	// Save user to database and return the user
	const user = await this.create({
		email,
		username,
		password: hash,
		firstName,
		lastName,
	});

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

// Virtual methods that allow you to go to the user's profile.
userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);
