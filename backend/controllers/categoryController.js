const getErrorMap = require("../middleware/getErrorMap");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Category = require("../models/Category");
const Post = require("../models/Post");
const categoryValidators = require("../middleware/validators/categoryValidators");
const handledValidationErrors = require("../middleware/handleValidationErrors");
const ValidationError = require("../errors/ValidationError");



const createCategory = [
  categoryValidators.title,
  categoryValidators.description,
  handledValidationErrors,
  asyncHandler(async(req,res) => {

    /*
    - Check if a category already exists with that name. Use regex to consider casing so 
      a category "PolItICs" and "politics" are duplicates.
    */
    const existingCategory = await Category.findOne({ title: { $regex: new RegExp('^' + req.body.title + '$', 'i') } });
    if (existingCategory) {
      const err = new ValidationError("title", "A category already exists with that title!", 400);
      throw err; // Throw error to middleware function
    }

    /*
    - Create a slug for the category
    - NOTE: Titles can only be alphanumeric with spaces, and at this point, we've determined that the title entered
      is unique with casing considered. So since the title is unique, and the slug is based on the title, only lowercasing 
      and placing hypens between spaces, then the slug should be unique as well.
    */
    const slug = slugify(req.body.title, {
      lower: true, // lowercases the string 
      replacement: "-", // replaces spaces with '-'
      strict: true, // removes all other special characters apart from replacement
      trim: true , // trims leading and trailing replacement characters
    })

    // No errors, so save the category
    const category = await Category.create({
      title: req.body.title,
      description: req.body.description,
      slug
    });

    res.status(200).json(category);
  })
]

const deleteCategory = asyncHandler(async(req, res) => {
  // Attempt to find category by given ID
  await Category.findCategoryByID(req.params.id);

  // At this point, category exists, so delete the category
  const result = await Category.findByIdAndDelete(req.params.id);

  res.status(200).json(result);
})

const updateCategory = [
  categoryValidators.title,
  categoryValidators.description,
  handledValidationErrors,
  asyncHandler(async(req,res) => {
    // At this point, attempt to find Category based on the ID given
    const category = await Category.findCategoryByID(req.params.id);

    /*
    - Exclude the category being updated by ensuring its _id is not included. This prevents 
      falsely flagging the current category as a duplicate title, even if the title hasn't changed.
    
    - Check for any existing category document with a title that matches the inputted title,
      using a case-insensitive regular expression.
    */
    const existingCategory = await Category.findOne({_id: {$ne: req.params.id}, title: { $regex: new RegExp('^' + req.body.title + '$', 'i') } });
    if (existingCategory) {
      const err = new ValidationError("title", "A category already exists with that title!", 400);
      throw err;
    }

    /*
    - Good title, description, and ID at this point:
    1. Apply changes to the title, if any
    2. Apply changes to description, if any.
    3. Apply changes to the slug, if any.
    - NOTE: We know the title either changed to something unique, or stayed 
      the same, so we can safely create a valid/unique slug for the updated 
      category.
    */
    category.title = req.body.title;
    category.description = req.body.description;
    category.slug = slugify(req.body.title, {
      lower: true, 
      replacement: "-",
      strict: true,
      trim: true , 
    })

    await category.save()

    // Return new category as JSON
    res.status(200).json(category);
  })
]

/*
+ Gets all categories

- NOTE: In the case there are no categories, we still return a 200 to indicate
  that their request went through, it's just that there were none available.
*/
const getCategories = asyncHandler(async(req, res) => {
  const categoryList = await Category.find();
  res.status(200).json(categoryList);
})

/*
+ Get the category's info and all posts in that category
*/
const getCategoryDetails = asyncHandler(async(req, res) => {

  // Attempt to find associated category and all posts that are under that category
  const [category, posts] = await Promise.all([
    Category.findCategoryByID(req.params.id),
    Post.find({
      category: req.params.id
    })
  ]);

  // Then return category and all posts
  res.status(200).json({
    category,
    posts
  });
})

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getCategoryDetails
}