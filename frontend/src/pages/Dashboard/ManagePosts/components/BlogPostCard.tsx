import {
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  CardActionArea,
  Typography,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import { MouseEvent } from "react";
import { formatBlogPostDate } from "../../../../api/intl";
import BasicMenu, {
  MenuItemProps,
} from "../../../../components/menus/BasicMenu";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IPost } from "../../../../types/Post";

import UserAvatar from "../../../../components/img/UserAvatar";

interface IBlogPostCardProps {
  post: IPost;
  className?: string;
  cardActions: MenuItemProps[];
  onCardClick: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

const minCardWidth = 300;
const truncateWidth = minCardWidth - 125;
export default function BlogPostCard({
  post,
  onCardClick,
  cardActions,
  ariaLabel,
  disabled = false,
}: IBlogPostCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const theme = useTheme();

  // Turn open into a boolean
  const open = !!anchorEl;

  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  // Here, isLoading is false, so we should have a 'post' with info to render
  return (
    <Card
      className="tw-overflow-hidden tw-shadow-2xl tw-rounded-lg tw-max-w-96"
      sx={{ background: theme.palette.background.paper }}>
      <CardHeader
        avatar={
          <UserAvatar
            fullName={post.user.fullName}
            src={post.user.avatarSrc}
            className="tw-mr-2"
          />
        }
        action={
          <IconButton aria-label="settings" onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography noWrap sx={{ width: truncateWidth }}>
            {post.user.username}
          </Typography>
        }
        subheader={formatBlogPostDate(post.createdAt)}
      />
      <CardActionArea
        onClick={onCardClick}
        disabled={disabled}
        aria-label={ariaLabel}>
        <CardMedia
          sx={{
            height: 200,
          }}
          className="tw-max-w-full tw-object-cover"
          image={post.imgSrc}
        />
        <CardContent>
          <Typography className="tw-line-clamp-2 tw-text-xl tw-font-medium lg:tw-text-xl">
            {post.title}
          </Typography>
          <Typography>
            {/* 
              - Could happen when a posts's category is deleted. In that case we 
              use conditional chaining, and this logic to indicate that.
              */}
            Category: {post.category?.title || "No category"}
          </Typography>

          {post.tags.length > 0 ? (
            <Stack
              direction="row"
              className="tw-flex-wrap tw-justify-start tw-items-center tw-gap-2">
              <Typography>Tags: </Typography>
              {post.tags.map((tag, index) => (
                <Typography key={index}>{tag.title}</Typography>
              ))}
            </Stack>
          ) : (
            <Typography>Tags: No tags yet</Typography>
          )}

          <Typography>Status: {post.status}</Typography>
        </CardContent>
      </CardActionArea>

      <BasicMenu
        open={open}
        anchorEl={anchorEl}
        items={cardActions}
        handleClose={handleCloseMenu}
      />
    </Card>
  );
}
