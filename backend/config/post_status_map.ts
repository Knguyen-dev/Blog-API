interface PostStatusMap {
  draft: string,
  published: string,
  private: string,
}

const post_status_map: PostStatusMap = {
  draft: "draft",
  published: "published",
  private: "private",
}

export {post_status_map};