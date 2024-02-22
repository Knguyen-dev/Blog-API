/*
+ Intro to cards in Mui: 


1. Card: Surface level container for grouping related components.
2. Card Content: The warpper for the card's content
3. Card header: Optional wrapper for your card's header
4. Card Media: Optional container for displaying stuff like images on your card
5. Card Actions: Optional wrpaper that groups a set of buttons. So this is where 
  you'd put the 'action' buttons on your card
6. Card action area: Optional wrapper that allows users ot interact with a 
  specific area on the card. So like just another 'actions' wrapper, but you'd 
  use it if you want to cover other cases.
*/
import {
	Typography,
	CardMedia,
	CardContent,
	Card,
	Avatar,
	Box,
} from "@mui/material";

import CommentIcon from "@mui/icons-material/Comment";

import PropTypes from "prop-types";

/*
- Amount of characters we'll show before we truncate the title string. Youtube
  has similar amounts of length, and also it seems like if we want to have multiple lines 
  of text, but also be able to truncate it, then this is the best way to go. There 
  are other methods, but they are considered hacks and don't cross over to other platforms.
*/

const truncateLength = 75;

export default function PostCard({
	maxWidth,
	imageHeight,
	postObj,
	cardHeight,
}) {
	return (
		<Card sx={{ maxWidth, height: cardHeight }} className="tw-cursor-pointer">
			<CardMedia
				sx={{ height: imageHeight }}
				image={postObj.image}
				title={postObj.title} // appears when you hover over image
			/>
			<CardContent className="tw-flex tw-gap-x-3">
				<Avatar src={postObj.image}></Avatar>

				<Box className="">
					<Typography
						variant="p"
						component="div"
						sx={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "normal",
						}}>
						{postObj.title.length > truncateLength
							? `${postObj.title.slice(0, truncateLength)}...`
							: postObj.title}
					</Typography>

					{/* Author name has muted text color */}
					<Typography variant="span" className="tw-text-gray-400" fontSize={14}>
						{postObj.authorName}
					</Typography>

					<Box className="tw-flex tw-text-gray-400">
						<Box className="tw-flex tw-items-center tw-gap-x-1">
							<CommentIcon sx={{ fontSize: 16 }} />
							<Typography>{postObj.numComments}</Typography>
						</Box>

						<Typography className="tw-mx-1">&#8226;</Typography>

						<Typography>{postObj.timePosted}</Typography>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
}

PostCard.propTypes = {
	maxWidth: PropTypes.number,
	imageHeight: PropTypes.number,
	cardHeight: PropTypes.number,
	postObj: PropTypes.object,
};
