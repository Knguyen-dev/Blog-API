const getErrorMap = require("../middleware/getErrorMap");
const asyncHandler = require("express-async-handler");
const tagValidators = require("../middleware/validators/tagValidators");
const handleValidationErrors = require("../middleware/handleValidationErrors")

const {Tag, tagEvents} = require("../models/Tag")

const Post = require("../models/Post");

// createTag: Creates a tag
const createTag = [
  tagValidators.title,
  handleValidationErrors,

  asyncHandler(async(req, res) => {

    // Check if a tag with that title already exists.
    const existingTag = await Tag.findOne({ title: { $regex: new RegExp('^' + req.body.title + '$', 'i') } });
    if (existingTag) {
      const err = new Error("A tag already exists with that title!")
      err.statusCode = 400;
      throw err;
    }

    // Title is unique, so create the tag in the database.
    const tag = await Tag.create({title: req.body.title});

    // Return the successfully created tag
    res.status(200).json(tag);
})]

// deleteTag: Deletes a tag based on its ID
const deleteTag = asyncHandler(async(req, res) => {
  // Check if tag ID is valid and the tag exists in the database
  await Tag.findTagByID(req.params.id);

  // At this point tag exists so delete it
  const result = await Tag.findByIdAndDelete(req.params.id);

  // Return the deleted tag 
  res.status(200).json(result);
})



/**
 * Event listener handles removing the deleted tag ID from the 'tags'
 * array for the posts in the database
 * 
 * @param (string) deletedTagID - ID of the tag being deleted. Passed in when the pre('findOneAndDelete')
 *                                hook is called.
*/

tagEvents.on("tagDeleted", async(deletedTagID) => {
  try {
    await Post.updateMany(
      {
        // Get all posts with 'deletedTagID' in their tags array
        tags: deletedTagID, 
      },
      {
        $pull: {
          // Remove the deletedTagID from their tags array.
          tags: deletedTagID,
        }
      }
    )
  } catch (err) {
    console.error("Error removing deleted tag ID from posts: ", err);
  }
})
/*
- NOTE: Of course for the event listener to work, ensure that 'tagController'
  is imported somewhere, so that the code in the file is executed. Since 
  we're in a controller, and we export it for our tagRouter, and that router
  is used in our express app, this is fine.  
*/

// updateTag: Updates a tag 
const updateTag = [
  tagValidators.title,
  handleValidationErrors,
  asyncHandler(async(req, res) => {
    // Check if tag ID is valid and the tag exists in the database
    const tag = await Tag.findTagByID(req.params.id);

    /*
    - Check if a tag with that title already exists. 
    
    - However don't include the tag ID of the tag we're currently updating.
      This allows us to avoid accidentally tagging the current tag 
      for having a duplicate title. This is useful when simply
      updating the casing of a tag. For example updating a tag
      from "myTaG" to "MyTag"
    */
    const existingTag = await Tag.findOne({ _id: {$ne: req.params.id}, title: { $regex: new RegExp('^' + req.body.title + '$', 'i') } });
    if (existingTag) {
      const err = new Error("A tag already exists with that title!");
      err.statusCode = 400;
      throw err;
    }

    // Appy changes to the tag, save to database, and send updated tag back as json.
    tag.title = req.body.title;
    await tag.save();
    res.status(200).json(tag);
  })
];

// 
const getTags = asyncHandler(async(req, res) => {
  const tagList = await Tag.find();
  res.status(200).json(tagList);
})

// getTagDetails: The tag and also the posts associated with that tag.
const getTagDetails = asyncHandler(async(req, res) => {

  // Attempt to find tag, and posts associated with tag
  const [tag, posts] = await Promise.all([
    await Tag.findTagByID(req.params.id),
    await Post.find({tags: req.params.id})
  ]);


  // Return the tag, and posts associated with the tag
  res.status(200).json({tag, posts});
})




module.exports = {
  createTag,
  deleteTag,
  updateTag,
  getTags,
  getTagDetails
}