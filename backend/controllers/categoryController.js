const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Category = require("../models/Category");
const Post = require("../models/Post");
const categoryValidators = require("../middleware/validators/categoryValidators");
const handledValidationErrors = require("../middleware/handleValidationErrors");


/**
 * Function for creating a new cateogry
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const createCategory = [
  categoryValidators.title,
  categoryValidators.description,
  handledValidationErrors,
  asyncHandler(async(req,res) => {

    // Create slug from the title
    const slug = slugify(req.body.title, {
      lower: true, // lowercases the string 
      replacement: "-", // replaces spaces with '-'
      strict: true, // removes all other special characters apart from replacement
      trim: true , // trims leading and trailing replacement characters
    })

    /*
    - Check if there's a category with that title and slug. Use regex to consider casing so 
      a category "PolItICs" and "politics" are duplicates. We want both to be unique 
    */
    const existingCategory = await Category.findOne({ title: { $regex: new RegExp('^' + req.body.title + '$', 'i') }, slug: slug });
    if (existingCategory) {
      // if the title was matched
      const err = new Error("");
      err.statusCode = 400;

      if (existingCategory.title.toLowerCase() === req.body.title.toLowerCase()) {
        err.message = "A category already exists with that title!"
      } else {
        // Else the slug must have matched, so warn the user.
        err.message = `The title "${req.body.title}" generates a slug that already exists for category "${existingCategory.title}"! Please make your title more unique!`;
      }
      throw err; // Throw error to middleware function
    }

    // Input is valid, so save the new category to the database
    const category = await Category.create({
      title: req.body.title,
      description: req.body.description,
      slug
    });

    // Return category as json
    res.status(200).json(category);
  })
]

/**
 * Function for deleting an existing category.
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const deleteCategory = asyncHandler(async(req, res) => {
  // Attempt to find category by given ID
  await Category.findCategoryByID(req.params.id);

  // At this point, category exists, so delete the category
  const result = await Category.findByIdAndDelete(req.params.id);

  res.status(200).json(result);
})

/**
 * Function for updating an exposting category
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const updateCategory = [
  categoryValidators.title,
  categoryValidators.description,
  handledValidationErrors,
  asyncHandler(async(req,res) => {
    // At this point, attempt to find Category based on the ID given
    const category = await Category.findCategoryByID(req.params.id);

    // Create slug based on title
    const slug = slugify(req.body.title, {
      lower: true, 
      replacement: "-",
      strict: true,
      trim: true , 
    })
    /*
    - Exclude the category being updated by ensuring its _id is not included. This prevents 
      falsely flagging the current category as a duplicate title or slug. Good for when they're 
      updating and for some reason the title hasn't changed, so as a result we wouldn't flag them.
    */
    const existingCategory = await Category.findOne({_id: {$ne: req.params.id}, title: { $regex: new RegExp('^' + req.body.title + '$', 'i') }, slug: slug });
    if (existingCategory) {
      const err = new Error("");
      err.statusCode = 400;

      if (existingCategory.title.toLowerCase() === req.body.title.toLowerCase()) {
        err.message = "A category already exists with that title!"
      } else {
        // Else the slug must have matched, so warn the user.
        err.message = `The title "${req.body.title}" generates a slug that already exists for category "${existingCategory.title}"! Please make your title more unique!`;
      }

      throw err; // Throw error to middleware function
    }

    // Good data, so assign and save changes
    category.title = req.body.title;
    category.description = req.body.description;
    category.slug = slug;

    await category.save()

    // Return new category as JSON
    res.status(200).json(category);
  })
]

/**
 * Gets all categories
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 * 
 * NOTE: In the case that there are no categories, we will still return a 200 ot indicate
 * that their request went through and was successful, it's just that none were available.
 */
const getCategories = asyncHandler(async(req, res) => {
  const categoryList = await Category.find();
  res.status(200).json(categoryList);
})


/**
 * Get the category details
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
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