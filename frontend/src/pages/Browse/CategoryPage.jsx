import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, Container } from "@mui/material";
import SearchBar from "../../components/Input/SearchBar";
import usePublicFetchData from "../../hooks/usePublicFetchData";
import PostCard from "./PostCard";

export default function CategoryPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isLoading, error, fetchData } = usePublicFetchData(
		`/categories/${id}/posts/published`
	);

	// Will redirect the user to the not found page, if 404 (category not found)
	useEffect(() => {
		if (error?.statusCode === 404) {
			navigate("/not-found");
		}
	}, [error, navigate]);

	const handleSearchPosts = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const title = formData.get("search");
		let endPoint = `/categories/${id}/posts/published`;

		/*
    - Fetch new posts for said category, include the title

    NOTE: If title is an empty string, the backend will act accordingly and 
    not filter the posts by title. As a result, we'd get all posts for that 
    category.
    */
		await fetchData(endPoint, {
			params: {
				title,
			},
		});
	};

	return (
		<div className="tw-flex-1 tw-flex-col tw-flex">
			<main className="tw-p-8 tw-overflow-y-auto">
				<Container maxWidth="md" className="tw-text-center">
					{data && (
						<>
							<Typography className="tw-mb-2" variant="h4">
								Category: {data.category.title}
							</Typography>
							<Typography>{data.category.description}</Typography>
						</>
					)}
					<SearchBar
						className="tw-mt-4"
						onSubmit={handleSearchPosts}
						placeholder="Search Post By Title!"
						name="search"
					/>
				</Container>

				<Box className="tw-flex tw-w-full tw-flex-wrap tw-justify-evenly tw-gap-4 tw-p-5">
					{isLoading ? (
						<Typography variant="h4" className="tw-text-center">
							Loading in posts...
						</Typography>
					) : error ? (
						<Typography className="tw-text-center">{error.message}</Typography>
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
