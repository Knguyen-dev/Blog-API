/*
+ ManagePostsPage: Will be a page where users can see hte posts that they've published, 
  or if they're admins, see all posts in the database. Still working on the kinks though
  since maybe we also want to include a place to manage tags. As well as this we still
  need to figure out, if we're going to limit post deletion privileges to just admins, but 
  editors as well. And how we need to modify the data-grid for that, how to create endpoints 
  with authorization rules for that, etc.
*/

import { Typography } from "@mui/material";
import useAuthContext from "../../../hooks/useAuthContext";
import PostGrid from "../components/PostGrid";

export default function ManagePostsPage() {
	const { auth } = useAuthContext();
	return (
		<div>
			<header className="tw-mb-4 tw-flex tw-justify-between">
				<Typography variant="h5">Manage Posts</Typography>
			</header>

			<PostGrid user={auth.user} />
		</div>
	);
}
