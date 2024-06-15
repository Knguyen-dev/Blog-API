import getCurrentDateStr from "../../../utils/getCurrentDateStr";
import { IPostState, PostStatusType } from "../../../types/Post";

// The various 'status' a post can be in.
interface PostStatusOption {
  label: string;
  value: PostStatusType;
}

const postStatuses: PostStatusOption[] = [
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Private",
    value: "private",
  },
];

/*
- Minimum word count for a post.
- NOTE: This value should match whatever we have on our backend.
*/
const minWordCount = 150;

const todayStr = getCurrentDateStr();

const initialPostState: IPostState = {
  title: "",
  body: "",
  category: undefined,
  wordCount: 0,
  tags: [],
  imgSrc: "",
  imgCredits: "",
  status: "draft",
  authorName: "", // populate this with auth.user.fullName on render
  createdAt: todayStr, // default value is iso string representing today/now
};

export { minWordCount, postStatuses, initialPostState, todayStr };
