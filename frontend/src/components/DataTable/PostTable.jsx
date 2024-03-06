// import DataTable from "./DataTable";
import { DataGrid } from "@mui/x-data-grid";
import { sampleTablePosts } from "../../assets/samplePosts";
import PropTypes from "prop-types";

/*
- For PostTable, since the id of posts are probably going to 
  be '_id' you'll probably need to pass a function into MUI's 
  prop 'getRowId'. More on that here: https://mui.com/x/react-data-grid/row-definition/


- NOTE: Probably need to add an actions field to hold a menu, then 
  on said menu you can edit or delete. Edit should probably take you to 
  our post creation page, where you can create/edit a post. Then 
  our delete would probably make a dialog box open asking you to 
  confirm your choice. For editing I may want to copy 'actions' example 
  because it some code on how to cancel the edit, and also it's actually
  a pretty good example no lie.

+ Server-side persistence: 
- processRowUpdate: Called when user stops editing callback is 
  triggered. We'll use it to send values to our server and save 
  changes to the database. We pass in the updated and the original 
  row when updating. 



- https://mui.com/x/react-data-grid/editing/#server-side-persistence
*/

const rows = sampleTablePosts.map((postObj) => {
	return {
		id: postObj.id,
		title: postObj.title,
		author: postObj.author,
		category: postObj.category,
		datePosted: postObj.datePosted,
		status: postObj.status,
	};
});

export default function PostTable({ auth }) {
	const columns = [
		{
			field: "id",
			headerName: "ID",
			maxWidth: 50, // Expecting object id, which is a long string, so we'll shorten it
		},
		{
			field: "title",
			headerName: "Title",
			flex: 1,
			hideable: false,
		},
		{
			field: "category",
			headerName: "Category",
			width: 150,
		},
		{
			field: "datePosted",
			headerName: "Date Posted",
			width: 200,
		},
		{
			field: "status",
			headerName: "Status",
			editable: true,
		},
	];

	// Add the 'author' column only if the user is an admin
	if (auth.user.role === parseInt(import.meta.env.VITE_ROLE_ADMIN)) {
		columns.splice(2, 0, {
			field: "author",
			headerName: "Author",
			width: 150,
			hideable: false,
		});
	}

	return <DataGrid rows={rows} columns={columns} />;
}

PostTable.propTypes = {
	auth: PropTypes.shape({
		user: PropTypes.shape({
			role: PropTypes.number,
		}),
		accessToken: PropTypes.string,
	}),
};
