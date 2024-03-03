import { Button, Typography, Container, Box } from "@mui/material";
import SearchBar from "../../components/Input/SearchBar";
import useAuthContext from "../../hooks/user/useAuthContext";
import PostTable from "../../components/DataTable/PostTable";

/*
 -Use 'columnVisibilityModel' prop to control what columns are visible. So this makes 
  sense, as when the user is an editor, they're only going to see their own posts, so the
  'author' column isn't needed, however, if the user is an admin, we'll use the author column.
*/

export default function ManagePostsPage() {
	const { auth } = useAuthContext();

	return (
		<div>
			<header className="tw-mb-4 tw-flex tw-justify-between">
				<Typography variant="h5">Manage Posts</Typography>
				<Box>
					<Button variant="contained" className="tw-ml-2">
						Create Post
					</Button>
				</Box>
			</header>

			<main>
				<Container maxWidth="md" className="tw-flex">
					<SearchBar
						placeholder="Search posts by title"
						className="tw-flex-1"
					/>
				</Container>

				<Container maxWidth="lg" className="tw-mt-5">
					<PostTable auth={auth} />
				</Container>
			</main>
		</div>
	);
}
