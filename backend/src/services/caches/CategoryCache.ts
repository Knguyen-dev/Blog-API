/*
+ Caching categories

- GET '/categories': Here we'll cache a list of categories. However, we 
  want to invalidate our cache and get fresh data when our database 
  of categories is updated. So invalidate the cache when they 
  add new categories, remove old ones, or update ones.

  This helps because let's say an editor creates a category on the front-end
  and they refresh. If we didn't invalidate the cache, they would simply
  not see their newly created category because they're seeing old data.

  Well have this same idea when talking about caching 'tags'. If the user 
  updates the name of the tag on the front-end, we'll have to invalidate 
  our 'tags' key (containing our list of tags in the redis), so that 
  the user fetches fresh data containing our tags.

  As well as this what if a tag or category is deleted, are we going to 
  invalidate the 'posts' that have those tags. Of course this is all complex
  but it's made easier if we organized our code and operations

- 

*/

import { getCache, setCache, deleteCache } from "./redis.services"

class CategoryCache {
  private categoriesKey: string;

  constructor () {
    // For GET '/categories' route
    this.categoriesKey = "/categories"
  }

  async getCachedCategories() {  
    return await getCache(this.categoriesKey);
  }
  
  async setCachedCategories(categories: any[]) {
    const expiration = 60 * 60; // 1 hour 
    await setCache(this.categoriesKey, expiration, categories);
  }

  async deleteCachedCategories() {
    await deleteCache(this.categoriesKey);
  }
}


// instantiate and export it
const categoryCache = new CategoryCache();
export default categoryCache; 