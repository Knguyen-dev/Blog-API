/*
+ NewPostPreview: Component used to display a post. So if user clicks on a post/article, we'll
  use this component to display that article in detail!
*/

import { Box, Typography, Divider } from "@mui/material";
import { formatBlogDate } from "../../api/intl";
import { TagContainer } from "../../components/styles/TagContainer.styled";
import useTagRedirect from "./hooks/useTagNavigation";
import useCategoryNavigation from "./hooks/useCategoryNavigation";
import { ICategory, ITag } from "../../types/Post";

interface INewPostPreviewProps {
  title: string;
  category?: ICategory;
  body: string;
  dateStr: string;
  authorName: string;
  imgSrc: string;
  imgCredits: string;
  tags?: ITag[];
}

export default function NewPostPreview({
  title,
  category,
  body,
  dateStr,
  authorName,
  imgSrc,
  imgCredits,
  tags,
}: INewPostPreviewProps) {
  const handleTagRedirect = useTagRedirect();
  const goToCategoryPage = useCategoryNavigation();

  const dateObj = new Date(dateStr);
  return (
    <Box className="tw-p-4">
      {/* Header of the post:  has title, date published, category, author*/}
      <Box component="header">
        <Box className="tw-flex tw-justify-center">
          {category ? (
            <TagContainer
              className="hover:tw-cursor-pointer"
              onClick={() => goToCategoryPage(category._id)}>
              {category.title}
            </TagContainer>
          ) : (
            <TagContainer>No Category Yet</TagContainer>
          )}
        </Box>
        <Typography variant="h4" className="tw-text-center tw-mt-3">
          {title}
        </Typography>
        <Box className="tw-flex tw-justify-center">
          <Typography>
            Published on {formatBlogDate(dateObj)} | by {authorName}
          </Typography>
        </Box>

        <Box className="tw-mt-2">
          <img src={imgSrc} alt="" className="tw-w-full tw-object-cover" />
          <Typography
            variant="body2"
            className="tw-text-xs tw-text-gray-400 tw-italic">
            {imgCredits}
          </Typography>
        </Box>
      </Box>

      {/* Body of the post: Has the main content; make it focusable to make it easier to read */}
      <main
        tabIndex={0}
        className="post-preview"
        dangerouslySetInnerHTML={{
          __html: body,
        }}></main>

      <Divider className="tw-my-5" />

      {/* Footer of the post */}
      <Box component="footer" className="tw-text-center">
        {/* Post tags section: contains all tags associated with post */}
        {tags && tags.length > 0 && (
          <Box>
            <Typography variant="h4" component="h2" className="tw-mb-3">
              Tags
            </Typography>

            <Box className="tw-flex tw-justify-center tw-gap-x-4 tw-gap-y-2 tw-flex-wrap">
              {tags.map((tag, index) => (
                <TagContainer
                  className="tw-text-xs md:tw-text-sm hover:tw-cursor-pointer"
                  onClick={() => handleTagRedirect(tag._id)}
                  key={index}>
                  {tag.title}
                </TagContainer>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
