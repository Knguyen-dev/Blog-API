const mongoose = require("mongoose");
const queryUtils = require("../middleware/queryUtils");
const EventEmitter = require("events");

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 50,
    unique: true,
  }
}, {
  timestamps: true
})

tagSchema.statics.findTagByID = queryUtils.findDocumentByID;

/**
 * Custom toJSON method for tag objects
 * 
 */
tagSchema.methods.toJSON = function() {
  const tabObj = this.toObject();
  delete tabObj.createdAt;
  delete tabObj.updatedAt;
  delete tabObj.__v;
  return tabObj;
}



/*
+ Handles cleaning up post's collection when deleting tags
- ISSUE: When tags are deleted, if those tag IDs are in arrays
  contained in the Post collection, they will remain there. So you could have 
  tag IDs, that point to already-deleted tags.   
  
- SOLUTION: To prevent this, we'll fire a middleware anytime before deleteOne 
  is executed on a tag. This middleware will remove that deleted tag from all
  posts.

- NOTE: Pre-hook middleware functions are only triggered by certain commands. Here, this 
  is triggered by using the findOneAndDelete and findByIdAndDelete commands. 
  So to ensure this pre hook runs, we'll make sure to only use those commands.

+ Credits: https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()


+ Circular dependencies error:
Well 'Tag' is used in Post. And now we're referencing 
'Post' in tag? Which one is supposed to come first? That's 
what it is trying to tell us. But how do we solve this and solve our problem?

// Here's the bad function for future reference: 
tagSchema.pre("findOneAndDelete", async function (next) {
  // Id of the tag being deleted
  const tagId = this._conditions._id
  await Post.updateMany(
    {
      tags: this._id, // find all posts with the id in their tags array
    },
    {
      $pull: {
        tags: this._id, // remove the tag from the tags array
      }
    }
  )
  next();
})

- How to solve:
1. First remove import of Post.
2. Instead of relying on Post model, we'll create an event listener.
  Our event listener will open once application starts, and when a tag 
  is deleted, it will use the post model to delete the tags. As a result, we 
  let both models build, and then once they're done we use this event listener.
3. Then we create our event listener in tagController.js 
*/


// Create 'tagEvents' an emitter that we use to launch different types of events
const tagEvents = new EventEmitter();


/**
 * Handles emitting a tagDeletion event before a tag is deleted. This will then be 
 * caught and handle deleting tags in our posts.
 * 
 */
tagSchema.pre("findOneAndDelete", function (next) {
  tagEvents.emit("tagDeleted", this._conditions._id);
  next();
})


const Tag = mongoose.model("Tag", tagSchema);
module.exports = {
  Tag,
  tagEvents
}
