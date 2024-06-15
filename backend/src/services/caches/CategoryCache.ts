/*
+ Caching categories

- GET '/categories': Here we'll cache a list of categories. However, we 
  want to invalidate our cache and get fresh data when our database 
  of categories is updated. So invalidate the cache when they 
  add new categories, remove old ones, or update ones.

  As a result, we don't have to do a database operation to get 
  available categories everytime. As well being able to update and invalidate 
  the cache is very useful as it helps us keep the categories cache fresh in the 
  case where categories are added, updated, or removed.
  
  For example, this helps because let's say an editor creates a category on the front-end
  and they refresh. If we didn't invalidate the cache, they would simply
  not see their newly created category because they're seeing old data.
*/

import { getCache, setCache, deleteCache } from "./redis.services"

class CategoryCache {
  private categoriesKey: string;

  constructor () {
    // Cache key for GET '/categories' route
    this.categoriesKey = "/categories"
  }

  // Gets the cached categories
  async getCachedCategories() {  
    return await getCache(this.categoriesKey);
  }
  
  // Updates the key-value pair in the redis cache for our categories
  async setCachedCategories(categories: any[]) {
    const expiration = 60 * 60; // 1 hour 
    await setCache(this.categoriesKey, expiration, categories);
  }

  // Deletes/invalidates key-value pair for the categories cache
  async deleteCachedCategories() {
    await deleteCache(this.categoriesKey);
  }
}


// instantiate and export it
const categoryCache = new CategoryCache();
export default categoryCache; 