const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
			maxLength: 300,
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

commentSchema.virtual("netLikes").get(function () {
	return this.numLikes - this.numDislikes;
});

module.exports = mongoose.model("Comment", commentSchema);
