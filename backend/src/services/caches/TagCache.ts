import { getCache, setCache, deleteCache } from "../../config/redis";

/**
 * Class for managing our cache for all available tags
 */
class TagCache {
  // For GET '/tags' route
  private tagsKey: string;

  constructor() {
    this.tagsKey = "/tags"
  }

  async getCachedTags() {
    return await getCache(this.tagsKey);
  }

  async setCachedTags(tags: any) {
    const expiration = 60 * 60; // 1 hour;
    return await setCache(this.tagsKey, expiration, tags);
  }

  async deleteCachedTags() {
    await deleteCache(this.tagsKey);
  }
}

const tagCache = new TagCache();
export default tagCache;