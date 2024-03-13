const getErrorMap = require("../middleware/getErrorMap");
const asyncHandler = require("express-async-handler");
const tagValidators = require("../middleware/tagValidators");
const Tag = require("../models/Tag");
const Post = require("../models/Post");

// createTag: Creates a tag
const createTag = [
  tagValidators.title,

  asyncHandler(async(req, res) => {
    const errors = getErrorMap(req);

    // If there were syntax errors, return the error object
    if (Object.keys(errors).length !== 0) {
      return res.status(400).json(errors);
    }

    // Check if a tag with that title already exists.
    const existingTag = await Tag.findOne({ title: { $regex: new RegExp('^' + req.body.title + '$', 'i') } });
    if (existingTag) {
      return res.status(400).json({message: `A tag already exists with that title!`});
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

// updateTag: Updates a tag 
const updateTag = [
  tagValidators.title,
  asyncHandler(async(req, res) => {
    const errors = getErrorMap(req);
    
    // Check for syntax errors 
    if (Object.keys(errors).length !== 0) {
      return res.status(400).json(errors);
    }

    // Check if tag ID is valid and the tag exists in the database
    const tag = await Tag.findTagByID(req.params.id);


    /*
    - Check if a tag with that title already exists. 
    
    
    -However don't include the tag ID of the tag we're currently updating.
      This allows us to avoid accidentally tagging the current tag 
      for having a duplicate title. This is useful when simply
      updating the casing of a tag. For example updating a tag
      from "myTaG" to "MyTag"
    */
    const existingTag = await Tag.findOne({ _id: {$ne: req.params.id}, title: { $regex: new RegExp('^' + req.body.title + '$', 'i') } });
    if (existingTag) {
      return res.status(400).json({message: `A tag already exists with that title!`});
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