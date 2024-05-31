import { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import PostCard from "./PostCard";
import SearchBar from "../../components/Input/SearchBar";

import usePublicFetchData from "../../hooks/usePublicFetchData";

export default function TagPage() {
	const { id } = useParams();

	const { data, isLoading, error, fetchData } = usePublicFetchData(
		`/tags/${id}/posts/published`
	);

	const handleSearchPosts = async (e) => {
		e.preventDefault();

		// Get data from search
		const formData = new FormData(e.target);
		const title = formData.get("search");
		let endPoint = `/tags/${id}/posts/published`;

		// Fetch data for new endpoint; updates the states from custom hook
		await fetchData(endPoint, {
			params: {
				title,
			},
		});
	};

	return (
		<div className="tw-flex-1 tw-flex-col tw-flex">
			<main className="tw-p-8 tw-overflow-y-auto">
				<Box className="tw-w-1/2 tw-mx-auto tw-mt-3">
					{data && (
						<Typography className="tw-text-center tw-mb-2" variant="h4">
							Tag: {data.tag.title}
						</Typography>
					)}
					<SearchBar
						onSubmit={handleSearchPosts}
						placeholder="Search Post By Title!"
						name="search"
					/>
				</Box>
				<Box className="tw-flex tw-w-full tw-flex-wrap tw-justify-evenly tw-gap-4 tw-p-5">
					{isLoading ? (
						<Typography variant="h4" className="tw-text-center">
							Loading in posts...
						</Typography>
					) : error ? (
						<Typography className="tw-text-center" fontSize={36}>
							{error}
						</Typography>
					) : data?.posts?.length === 0 ? (
						<Typography className="tw-text-center">
							No posts found! Maybe try another title?
						</Typography>
					) : (
						data.posts.map((post, index) => (
							<PostCard key={index} postObj={post} />
						))
					)}
				</Box>
			</main>
		</div>
	);
}
