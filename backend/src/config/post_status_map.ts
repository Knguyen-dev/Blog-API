interface PostStatusMap {
  draft: string,
  published: string,
  private: string,
}

/**
 * Create the various 'status' values for a post.
 * 
 * draft: A post has been saved but not complete
 * published: Post is complete and should be visible
 * private: Post is complete, but it isn't visible to the public
 */
const post_status_map: PostStatusMap = {
  draft: "draft",
  published: "published",
  private: "private",
}

export {post_status_map};