// import DataTable from "./DataTable";
import EditSelectGrid from "./common/EditSelectGrid";
import { sampleTablePosts } from "../../assets/samplePosts";
import PropTypes from "prop-types";
import { useState, useMemo, useCallback, useEffect } from "react";
import useToast from "../../hooks/useToast";

const initialRows = sampleTablePosts.map((postObj) => {
	return {
		id: postObj.id,
		title: postObj.title,
		author: postObj.author,
		category: postObj.category,
		datePosted: postObj.datePosted,
		status: postObj.status,
	};
});

export default function PostGrid({ user }) {
	const [selectedRowID, setSelectedRowID] = useState();
	const [rows, setRows] = useState([]);
	const { showToast } = useToast();

	useEffect(() => {
		setRows(initialRows);
	}, []);

	// Only re-calculate columns when auth state changes
	const columns = useMemo(() => {
		let baseColumns = [
			{
				field: "id",
				headerName: "ID",
				maxWidth: 50, // Expecting object id, which is a long string, so we'll shorten it
			},
			{
				field: "title",
				headerName: "Title",
				flex: 1,
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
				type: "singleSelect",
				valueOptions: ["Published", "Unpublished", "Draft"],
			},
		];

		// Add the 'author' column only if the user is an admin
		if (user.role === parseInt(import.meta.env.VITE_ROLE_ADMIN)) {
			baseColumns.splice(2, 0, {
				field: "author",
				headerName: "Author",
				width: 150,
				hideable: false,
			});
		}

		return baseColumns;
	}, [user]);

	const processRowUpdate = useCallback(
		async (newRow) => {
			const response = { data: newRow };

			showToast({
				message: "Post update successful!",
				severity: "success",
			});

			return response.data;
		},
		[showToast]
	);

	const handleRowUpdateError = useCallback(
		(err) => {
			let errMessage = "";
			if (err.response) {
				errMessage = err.response.data.message;
			} else if (err.request) {
				errMessage = "Network error occurred!";
			} else {
				errMessage = "Something unexpected happened!";
			}
			showToast({ message: errMessage, severity: "error" });
		},
		[showToast]
	);

	return (
		<EditSelectGrid
			selectedRowID={selectedRowID}
			setSelectedRowID={setSelectedRowID}
			rows={rows}
			columns={columns}
			processRowUpdate={processRowUpdate}
			handleRowUpdateError={handleRowUpdateError}
			handleAddItem={() => console.log("Add item clicked")}
			handleRemoveItem={() => console.log("Remove item clicked!")}
			pageSizeOptions={[5, 10, 15]}
			initialPageSize={5}
		/>
	);
}

PostGrid.propTypes = {
	user: PropTypes.shape({
		role: PropTypes.number,
	}),
};
