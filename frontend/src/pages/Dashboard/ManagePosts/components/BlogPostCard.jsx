import {
	Card,
	CardContent,
	CardMedia,
	CardHeader,
	CardActionArea,
	Typography,
	Box,
	Avatar,
	Skeleton,
	IconButton,
} from "@mui/material";
import { formatBlogPostDate } from "../../../../api/intl";
import PropTypes from "prop-types";

import BasicMenu from "../../../../components/menus/BasicMenu";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

BlogPostCard.propTypes = {
	post: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string.isRequired,
		category: PropTypes.shape({
			title: PropTypes.string,
		}),
		user: PropTypes.shape({
			username: PropTypes.string.isRequired,
			fullName: PropTypes.string.isRequired,
			avatarSrc: PropTypes.string.isRequired,
			avatarInitials: PropTypes.string.isRequired,
		}),
		imgSrc: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired,
		tags: PropTypes.arrayOf(
			PropTypes.shape({
				title: PropTypes.string.isRequired,
			})
		),
	}),
	className: PropTypes.string,
	cardActions: PropTypes.array,
	onCardClick: PropTypes.func,
	isLoading: PropTypes.bool,
};

/*

+ About skeletons: 
It's honestly probably better to create the skeleton version of the component 
in the same component. However, if isLoading is true, then your data is probably
going to be null, so not even the skeleton will be rendered. However I think the 
idea is when isLoading, you'll rendering say maybe 10 skeletons for the sake of it.


+ BOOK MARK:
1. Looking good on the cards. They look better, but maybe you can optimize 
the states? Have ManagePostsPage use one state?
*/

const minCardWidth = 300;
const truncateWidth = minCardWidth - 125;
export default function BlogPostCard({
	post,
	onCardClick,
	cardActions,
	isLoading = false,
}) {
	const [anchorEl, setAnchorEl] = useState(null);

	// Turn open into a boolean
	const open = !!anchorEl;

	// If loading is true, return the loading skeleton representation of the card
	if (isLoading) {
		return (
			<Card
				sx={{
					minWidth: minCardWidth,
				}}>
				<CardHeader
					avatar={<Skeleton variant="circular" width={40} height={40} />}
					title={<Skeleton variant="text" height={20} width="80%" />}
					subheader={<Skeleton variant="text" height={20} width="50%" />}
				/>
				<Skeleton variant="rectangular" height={175} />
				<CardContent>
					<Skeleton variant="text" height={24} />
					<Skeleton variant="text" height={20} />
					<Skeleton variant="text" height={20} width="80%" />
				</CardContent>
			</Card>
		);
	}

	const handleCloseMenu = () => setAnchorEl(null);
	const handleOpenMenu = (e) => {
		setAnchorEl(e.currentTarget);
	};

	// Here, isLoading is false, so we should have a 'post' with info to render
	return (
		<Card className="tw-overflow-hidden tw-shadow-2xl  tw-rounded-lg tw-max-w-96">
			<CardHeader
				avatar={
					<Avatar
						alt={post.user.username}
						src={post.user.avatarSrc}
						className="tw-mr-2">
						{post.user.avatarInitials}
					</Avatar>
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
			<CardActionArea onClick={onCardClick}>
				<CardMedia
					sx={{
						width: 400,
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
					{post.tags.length > 0 && (
						<Box>
							<Typography className="tw-inline-block tw-text-sm tw-font-medium tw-text-gray-500">
								Tags: {post.tags.map((tag) => tag.title).join(", ")}
							</Typography>
						</Box>
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
