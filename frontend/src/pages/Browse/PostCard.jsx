import { Typography, Avatar, Stack } from "@mui/material";
import { formatBlogPostDate } from "../../api/intl";
import useTagRedirect from "./hooks/useTagRedirect";
import usePostRedirect from "./hooks/usePostRedirect";
import { TagContainer } from "../../components/styles/TagContainer.styled";
import PropTypes from "prop-types";

export default function PostCard({ postObj }) {
	const handleTagRedirect = useTagRedirect();
	const { handlePostRedirect } = usePostRedirect();

	const handleClick = () => {
		handlePostRedirect(postObj.slug);
	};

	const handleTagClick = (e, id) => {
		e.stopPropagation();
		handleTagRedirect(id);
	};

	return (
		<div
			className="tw-flex tw-flex-col tw-pb-6 tw-max-w-96 tw-overflow-hidden tw-shadow-2xl tw-gap-2 tw-rounded-lg hover:tw-cursor-pointer"
			onClick={handleClick}>
			<img
				width={400}
				height={200}
				className="tw-rounded-t-md tw-max-w-full tw-object-cover tw-mb-4"
				src={postObj.imgSrc}
			/>

			{postObj.tags.length > 0 && (
				<div className="tw-flex tw-flex-wrap tw-justify-start tw-items-center tw-px-4 tw-mb-2 tw-gap-2">
					{postObj.tags.map((tag, index) => (
						<TagContainer
							onClick={(e) => handleTagClick(e, tag._id)}
							className="tw-text-xs"
							key={index}>
							{tag.title}
						</TagContainer>
					))}
				</div>
			)}

			<div className="tw-line-clamp-2 tw-px-4 tw-text-xl tw-font-medium lg:tw-text-xl tw-text-slate-500">
				{postObj.title}
			</div>
			<div className="tw-px-4 tw-font-medium tw-flex tw-items-center">
				<Avatar src={postObj.user.avatarSrc} className="tw-mr-2">
					{postObj.user.avatarInitials}
				</Avatar>
				<Stack>
					<Typography className="tw-font-bold">
						{postObj.user.username}
					</Typography>
					<Typography className="tw-text-slate-500">
						{formatBlogPostDate(postObj.createdAt)}
					</Typography>
				</Stack>
			</div>
		</div>
	);
}

PostCard.propTypes = {
	postObj: PropTypes.object,
};
