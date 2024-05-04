import { useState } from "react";
import { Typography, Box, Grid } from "@mui/material";
import PostCard from "./PostCard";
import SearchBar from "../../components/Input/SearchBar";
import usePublicFetchData from "../../hooks/usePublicFetchData";
import NewBasicSelect from "../../components/select/NewBasicSelect";
import FilteredAutoSelect from "../../components/autocomplete/FilteredAutoSelect";
import useGetTags from "../EditorSuite/hooks/useGetTags";
import useGetCategories from "../EditorSuite/hooks/useGetCategories";

export default function BlogPage() {
	// Fetch all posts
	const {
		data: posts,
		isLoading,
		error,
		fetchData,
	} = usePublicFetchData("/posts/published");

	// Fetch all categories and tags
	const { tags } = useGetTags();
	const { categories } = useGetCategories();
	const [categoryID, setCategoryID] = useState(null);
	const [selectedTags, setSelectedTags] = useState([]);

	const handleSearchPosts = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const title = formData.get("search");
		let endPoint = "/posts/published";

		// data from our endpoint, yeah just pass in your query parameters here instead
		await fetchData(endPoint, {
			params: {
				title,
				category: categoryID,
				tags: selectedTags.map((tag) => tag._id),
			},
		});
	};

	return (
		<div className="tw-flex tw-flex-col tw-flex-1">
			<main className="tw-p-8 tw-overflow-y-auto">
				<div className="tw-mb-4 tw-text-center">
					<Box className="tw-mb-4">
						<Typography variant="h4">Welcome to Blog Sphere!</Typography>
						<Typography>
							Articles on tech, politics, and popular culture
						</Typography>
					</Box>

					<Grid
						container
						className="tw-items-center tw-justify-center tw-mx-auto"
						maxWidth={"md"}>
						<Grid item xs={12} className="tw-mb-3">
							<SearchBar
								onSubmit={handleSearchPosts}
								placeholder="Search Post By Title!"
								name="search"
							/>
						</Grid>

						{/* Our grid that containers the select components specifically */}
						<Grid
							container
							className="tw-justify-center tw-items-center tw-gap-2 ">
							<Grid item sm={3}>
								{categories && (
									<NewBasicSelect
										value={categoryID || ""}
										setValue={setCategoryID}
										options={categories}
										getOptionLabel={(option) => option.title}
										getOptionValue={(option) => option._id}
										label="Category"
									/>
								)}
							</Grid>
							<Grid item sm={7}>
								{tags && (
									<FilteredAutoSelect
										id="tags"
										label="Post Tags"
										placeholder="Select Tags"
										options={tags}
										selectedValues={selectedTags}
										setSelectedValues={setSelectedTags}
										getOptionLabel={(option) => option.title}
										isOptionEqualToValue={(option, value) =>
											option._id === value._id
										}
										limitTags={2}
									/>
								)}
							</Grid>
						</Grid>
					</Grid>
				</div>
				<div className="tw-flex tw-w-full tw-flex-wrap tw-justify-evenly tw-gap-4 tw-p-5">
					{isLoading ? (
						<Typography variant="h4">Loading in posts...</Typography>
					) : error ? (
						<Typography>{error.message}</Typography>
					) : posts.length === 0 ? (
						<Typography>No posts found! Maybe try another title?</Typography>
					) : (
						posts.map((post, index) => <PostCard key={index} postObj={post} />)
					)}
				</div>
			</main>
		</div>
	);
}
