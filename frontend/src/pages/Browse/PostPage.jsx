import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Typography, Container } from "@mui/material";
import NewPostPreview from "./NewPostPreview";
import usePublicFetchData from "../../hooks/usePublicFetchData";

export default function PostPage() {
	const { slug } = useParams();
	const navigate = useNavigate();

	const { data: post, error } = usePublicFetchData(
		`/posts/published/slug/${slug}`
	);

	// If we got a 404, then redirect the user to the not found page
	useEffect(() => {
		if (error?.status === 404) {
			navigate("/not-found");
		}
	}, [navigate, error]);

	return (
		<div className="tw-flex-1 tw-overflow-y-auto">
			<Container>
				{/* If post data was successfully gotten (defined) */}
				{post ? (
					<NewPostPreview
						title={post.title}
						category={post.category}
						body={post.body}
						dateStr={post.createdAt}
						authorName={post.user.fullName}
						imgSrc={post.imgSrc}
						imgCredits={post.imgCredits}
						// pass an array of strings to make it less complicated/coupled
						tags={post.tags}
					/>
				) : error ? (
					<Typography className="tw-text-center tw-py-4" variant="h3">
						Error: {error.message}
					</Typography>
				) : (
					<Typography>Loading in the post!</Typography>
				)}
			</Container>
		</div>
	);
}
