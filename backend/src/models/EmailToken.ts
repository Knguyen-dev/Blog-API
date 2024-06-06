const mongoose = require("mongoose");

/*
- You'd then create a separate schema, and this will create a collection that 
  tracks JWT tokens that you've sent to users in order to verify their emails!
*/

const emailTokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
    unique: true,
	},

	// Tokens are unique
	token: {
		type: String,
		required: true,
		unique: true,
	},

	createdAt: {
		type: Date,
		default: Date.now(),
		/*
    - Expires sets a TTL for the document. Essentially once the time is up, this
      document will be automatically deleted from the collection. So in this case, 
      the 'token' document with the 'expires' attribute, will be deleted 3600 seconds 
      after it was created. As a result when we send the verification link we can 
      say 'Hey this link is valid for like 1 hour'.

      NOTE: Expires 3600 seconds after createdAt field value?
    */
		expires: 3600,
	},
});

const EmailToken = mongoose.model("tokens", emailTokenSchema);
export default EmailToken;