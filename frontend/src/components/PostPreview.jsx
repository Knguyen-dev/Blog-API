import { Box, Typography, Divider } from "@mui/material";
import { TagContainer } from "./styles/TagContainer.styled";
import PropTypes from "prop-types";
import PrismJS from "prismjs";
import { useEffect } from "react";
const dateFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

PostPreview.propTypes = {
	title: PropTypes.string,
	category: PropTypes.string,
	body: PropTypes.string,
	dateObj: PropTypes.object,
	authorName: PropTypes.string,
	imgSrc: PropTypes.string,
	imgCredits: PropTypes.string,
	tags: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		})
	),
};

const currentYear = new Date().getFullYear();

export default function PostPreview({
	title,
	category,
	body,
	dateObj,
	authorName,
	imgSrc,
	imgCredits,
	tags,
}) {
	/*
  + Effect calls PrismJS to highlight/color code blocks:
  1. If there are <pre> tags in our post-preview, then call prism to highlight them.


  - NOTE: If it desperately affects performance, then we'll only run this once we 
    start displaying for real.
  */
	useEffect(() => {
		const preElements = document.querySelectorAll(".post-preview pre");
		if (preElements.length > 0) {
			PrismJS.highlightAll();
		}
	}, [body]);

	return (
		<Box component="main" className="tw-p-4">
			{/* Header of the post: has title, date published, category, author*/}
			<Box>
				{/* Post header: Category, title of post, author, post thumbnail/display image and credits */}
				<Box className="tw-flex tw-justify-center">
					<TagContainer>{category}</TagContainer>
				</Box>
				<Typography variant="h4" className="tw-text-center tw-mt-3">
					{title}
				</Typography>
				<Box className="tw-flex tw-justify-center">
					<Typography>{dateFormatter.format(dateObj)}</Typography>
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
							{tags.map((tag) => (
								<TagContainer
									className="tw-text-xs md:tw-text-sm"
									key={tag.value}>
									{tag.value}
								</TagContainer>
							))}
						</Box>
					</Box>
				)}

				{/* Fake copyright section */}
				<Box className="tw-mt-5">
					<Typography variant="body2" className="tw-text-gray-500">
						&copy; {currentYear} BlogSphere. All rights reserved.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
