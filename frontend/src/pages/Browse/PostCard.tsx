import {
  Box,
  Typography,
  Stack,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import { formatBlogPostDate } from "../../api/intl";
import useTagNavigation from "./hooks/useTagNavigation";
import usePostNavigation from "./hooks/usePostNavigation";
import { TagContainer } from "../../components/styles/TagContainer.styled";
import UserAvatar from "../../components/img/UserAvatar";
import { IPost } from "../../types/Post";
import { MouseEvent } from "react";

import { useTheme } from "@mui/material";

interface PostCardProps {
  postObj: IPost;
}

/**
 * Card that renders information for a blog post. This card should be used for
 * on the Blog page, and the average unauthenticated user will be able to see it.
 */
export default function PostCard({ postObj }: PostCardProps) {
  const goToTagPage = useTagNavigation();
  const { goToPostPage } = usePostNavigation();

  const theme = useTheme();

  const handleClick = () => {
    goToPostPage(postObj.slug);
  };

  const handleTagClick = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    goToTagPage(id);
  };

  return (
    <Card
      sx={{ background: theme.palette.background.paper }}
      className="tw-max-w-96 tw-shadow-2xl">
      <CardMedia
        component="img"
        sx={{ height: 200 }}
        image={postObj.imgSrc}
        alt=""
      />
      <CardActionArea onClick={handleClick}>
        <CardContent className="tw-flex tw-flex-col tw-gap-y-1.5 tw-mx-2">
          {postObj.tags.length > 0 && (
            <Stack
              direction="row"
              className="tw-flex-wrap tw-justify-start tw-items-center tw-gap-2">
              {postObj.tags.map((tag, index: number) => (
                <TagContainer
                  onClick={(e) => handleTagClick(e, tag._id)}
                  className="tw-text-xs"
                  key={index}>
                  {tag.title}
                </TagContainer>
              ))}
            </Stack>
          )}
          <Typography className="tw-line-clamp-2 tw-text-xl tw-font-medium lg:tw-text-xl">
            {postObj.title}
          </Typography>
          <Box className="tw-font-medium tw-flex tw-items-center">
            <UserAvatar
              fullName={postObj.user.fullName}
              src={postObj.user.avatarSrc}
              className="tw-mr-2"
            />
            <Stack>
              <Typography className="tw-font-bold">
                {postObj.user.username}
              </Typography>
              <Typography>{formatBlogPostDate(postObj.createdAt)}</Typography>
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
