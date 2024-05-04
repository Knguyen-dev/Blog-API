/*
+ NewPostPreview: Component used to display a post. So if user clicks on a post/article, we'll
  use this component to display that article in detail!


+ Implementing Take redirect at the bottom.
1. Pass in tag objects


*/

import { Box, Typography, Divider } from "@mui/material";
import { formatBlogDate } from "../../api/intl";
import { TagContainer } from "../../components/styles/TagContainer.styled";
import useTagRedirect from "./hooks/useTagNavigation";
import useCategoryNavigation from "./hooks/useCategoryNavigation";

import PropTypes from "prop-types";

export default function NewPostPreview({
	title,
	category,
	body,
	dateStr,
	authorName,
	imgSrc,
	imgCredits,
	tags,
}) {
	const handleTagRedirect = useTagRedirect();
	const goToCategoryPage = useCategoryNavigation();

	const dateObj = new Date(dateStr);
	return (
		<Box component="main" className="tw-p-4">
			{/* Header of the post:  has title, date published, category, author*/}
			<Box>
				{/* Post header: Category (may not be selected yet), title of post, author, post thumbnail/display image and credits */}
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
					<Typography>Published on {formatBlogDate(dateObj)}</Typography>
					<Typography variant="span" sx={{ marginX: "0.5em" }}>
						|
					</Typography>
					<Typography>by {authorName}</Typography>
				</Box>

				<Box className="tw-mt-2">
					<img src={imgSrc} className="tw-w-full tw-object-cover" />
					<Typography
						variant="span"
						className="tw-text-xs tw-text-gray-400 tw-italic">
						{imgCredits}
					</Typography>
				</Box>
			</Box>

			{/* Body of the post: Has the main content */}
			<main
				className="post-preview"
				dangerouslySetInnerHTML={{
					__html: body,
				}}></main>

			<Divider className="tw-my-5" />

			{/* Footer if the post */}
			<Box component="footer" className="tw-text-center">
				{/* Post tags section: contains all tags associated with post */}
				{tags?.length > 0 && (
					<Box>
						<Typography variant="h5" className="tw-mb-3">
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

				{/* Fake copyright section */}
				<Box className="tw-mt-5">
					<Typography variant="body2" className="tw-text-gray-500">
						&copy; {dateObj.getFullYear()} BlogSphere. All rights reserved.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

// Accepts primitives to make things less coupled
NewPostPreview.propTypes = {
	title: PropTypes.string,
	category: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
	}),
	body: PropTypes.string,
	dateStr: PropTypes.string,
	authorName: PropTypes.string,
	imgSrc: PropTypes.string,
	imgCredits: PropTypes.string,
	tags: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string,
			title: PropTypes.string,
		})
	),
};
