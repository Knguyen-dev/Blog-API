import asyncHandler from "express-async-handler";
import categoryValidators from "../middleware/validators/categoryValidators";
import { handleValidationErrors } from "../middleware/errorUtils";
import categoryServices from "../services/category.services";
import { convertQueryParamToArray } from "../middleware/queryUtils";
import categoryCache from "../services/caches/CategoryCache";


/**
 * Function for creating a new category
 */
const createCategory = [
  categoryValidators.title,
  categoryValidators.description,
  handleValidationErrors,
  asyncHandler(async(req, res) => {
    // Attempt to create the category
    const category = await categoryServices.createCategory(
      req.body.title,
      req.body.description,
      // req.user should be defined as this goes through verifyJWT middleware
      req.user!.id
    );

    await categoryCache.deleteCachedCategories();

    // Return category as json
    res.status(200).json(category);
  })
]

/**
 * Function for deleting an existing category.
 */
const deleteCategory = asyncHandler(async(req, res) => {
  // Attempt to delete the category, and get the result
  const result = await categoryServices.deleteCategory(req.params.id);

  await categoryCache.deleteCachedCategories();

  // At this point, successfully deleted the category, so return the result
  res.status(200).json(result);
})

/**
 * Function for updating an exposting category
 */
const updateCategory = [
  categoryValidators.title,
  categoryValidators.description,
  handleValidationErrors,
  asyncHandler(async(req, res) => {

    // Attempt to update a category
    const category = await categoryServices.updateCategory(
      req.params.id, 
      req.body.title, 
      req.body.description, 
      // req.user should be defined with the id of course, since we go through verifyJWT middleware
      req.user!.id
    );

    await categoryCache.deleteCachedCategories();
    
    // Return new category as JSON
    res.status(200).json(category);
  })
]

/**
 * Gets all categories
 * 
 * NOTE: In the case that there are no categories, we will still return a 200 ot indicate
 * that their request went through and was successful, it's just that none were available.
 */
const getCategories = asyncHandler(async(req, res) => {
  let categories = await categoryCache.getCachedCategories();
  if (!categories) {
    categories = await categoryServices.getAllCategories();
    await categoryCache.setCachedCategories(categories);
  }
  res.status(200).json(categories);
});

/**
 * Get the category details
 * 
 */
const getCategoryAndPosts = asyncHandler(async(req, res) => {
  // Fetch category and posts
  const { category, posts } = await categoryServices.getCategoryAndPosts(req.params.id);

  // Then return category and all posts
  res.status(200).json({
    category,
    posts
  });
})

/**
 * Get the category details
 * 
 */
const getCategoryAndPublishedPosts = asyncHandler(async(req, res) => {

  const titleArr = convertQueryParamToArray(req.query.title);
  const {category, posts} = await categoryServices.getCategoryAndPosts(
    req.params.id, 
    {publishedOnly: true, titles: titleArr}
  )

  // Then return category and all posts
  res.status(200).json({
    category,
    posts
  });
})

export {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getCategoryAndPosts,
  getCategoryAndPublishedPosts
}
