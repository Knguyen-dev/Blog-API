const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},

		title: {
			type: String,
			require: true,
			maxLength: 50,
		},

		content: {
			type: String,
			required: true,
			maxLength: 1000,
		},

		isPublished: {
			type: Boolean,
			default: true,
		},

		isEdited: {
			type: Boolean,
			default: false,
		},

		numLikes: {
			type: Number,
			default: 0,
		},

		numDislikes: {
			type: Number,
			default: 0,
		},
	},
	{
		toJSON: { virtuals: true },
		timestamps: true,
	}
);

postSchema.virtual("netLikes").get(function () {
	return this.numLikes - this.numDislikes;
});

module.exports = mongoose.model("Post", postSchema);
