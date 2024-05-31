import { FormEvent, useState } from "react";
import { Typography, Box, Grid } from "@mui/material";
import PostCard from "./PostCard";
import { ITag, IPost } from "../../types/Post";
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
		error,
		fetchData,
	} = usePublicFetchData<IPost[]>("/posts/published");

	// Fetch all categories and tags
	const { tags } = useGetTags();
	const { categories } = useGetCategories();
	const [categoryID, setCategoryID] = useState<string | null>(null);

	// Obviously check if it's either undefined or an empty array after
	const [selectedTags, setSelectedTags] = useState<ITag[] | undefined>();

	const [title, setTitle] = useState("");

	const handleSearchPosts = async () => {
		let endPoint = "/posts/published";
		// data from our endpoint, yeah just pass in your query parameters here instead
		await fetchData(endPoint, {
			params: {
				title: title,
				category: categoryID,
				tags: selectedTags ? selectedTags.map((tag) => tag._id) : undefined,
			},
		});
	};

	return (
		<div className="tw-flex tw-flex-col tw-flex-1">
			{/* Actually maybe this can be called the header; what would we normally call this */}
			<Box component="header" className="tw-mb-4 tw-text-center">
				<Box className="tw-mb-4">
					<Typography variant="h4" component="h1">
						Welcome to Blog Sphere!
					</Typography>
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
							value={title}
							onChange={(e) => setTitle(e.target.value)}
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
									allowNone={true}
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
			</Box>

			{/* Render the cards for the blog page */}
			<main className="tw-flex tw-w-full tw-flex-wrap tw-justify-evenly tw-gap-4 tw-p-5">
				{posts ? (
					posts.length > 0 ? (
						posts.map((post, index) => <PostCard key={index} postObj={post} />)
					) : (
						<Typography>No posts found! Maybe try another title?</Typography>
					)
				) : error ? (
					<Typography>{error}</Typography>
				) : (
					<Typography variant="h4">Loading in posts...</Typography>
				)}
			</main>
		</div>
	);
}
