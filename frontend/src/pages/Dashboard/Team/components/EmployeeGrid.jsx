import { Box, Avatar } from "@mui/material";
import { useEffect, useCallback, useState } from "react";
import EditSelectGrid from "../../components/EditSelectGrid";
import RemoveEmployeeDialog from "./RemoveEmployeeDialog";

import useEmployeeContext from "../hooks/useEmployeeContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import employeeActions from "../data/employeeActions";
import { getRoleNumber, getRoleString } from "../utils/roleUtilities";
import useToast from "../../../../hooks/useToast";

import getErrorData from "../../../../utils/getErrorData";
import FormDialog from "../../../../components/dialog/FormDialog";

import AddEmployeeForm from "./AddEmployeeForm";

export default function EmployeeGrid() {
	const { state, dispatch } = useEmployeeContext();
	const { showToast } = useToast();
	const axiosPrivate = useAxiosPrivate();

	// Represents selected user
	const [selectedRowID, setSelectedRowID] = useState(null);
	const [activeDialog, setActiveDialog] = useState("");

	const handleOpenDialog = (dialogName) => setActiveDialog(dialogName);
	const handleCloseDialog = () => setActiveDialog("");

	// Effect loads employees into the employee state for the data-grid.
	useEffect(() => {
		const abortController = new AbortController();
		const getEmployees = async () => {
			try {
				const response = await axiosPrivate("/employees", {
					signal: abortController.signal,
				});
				// Set the employees state
				dispatch({
					type: employeeActions.SET_EMPLOYEES,
					payload: response.data,
				});
			} catch (err) {
				// If the request wasn't aborted, then a real error happened with the request
				if (!abortController.signal.aborted) {
					console.log("Failed to fetch employees: ", err);
				}
			}
		};

		getEmployees();

		return () => {
			abortController.abort();
		};
	}, [axiosPrivate, dispatch]);

	// Handles updating a row in our employee grid
	const processRowUpdate = useCallback(
		async (newRow) => {
			// Convert role back to its numerical representation for call to server
			newRow.role = getRoleNumber(newRow.role);

			const response = await axiosPrivate.patch(
				`/employees/${newRow._id}`,
				newRow
			);

			// Show success message on toast
			showToast({
				message: "User update successful",
				severity: "success",
			});

			/*
	    - Remember to update the global state. This allows things such as
	    the 'RemoveEmployeeDialog' to keep in sync.
	    */

			dispatch({
				type: employeeActions.UPDATE_EMPLOYEE,
				payload: response.data,
			});

			/*
	    - Return response, or the item that would meet the column criteria.
	      This is the thing that's directly responsible for the update in the
	      data grid.
	    */
			return response.data;
		},
		[axiosPrivate, dispatch, showToast]
	);

	// Handles showing potential errors for processRowUpdate
	const handleRowUpdateError = useCallback(
		(err) => {
			let errMessage = "";
			if (err.response) {
				errMessage = getErrorData(err).message;
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
		<Box>
			<EditSelectGrid
				selectedRowID={selectedRowID}
				setSelectedRowID={setSelectedRowID}
				rows={state.employees}
				getRowId={(row) => row._id}
				processRowUpdate={processRowUpdate}
				handleRowUpdateError={handleRowUpdateError}
				columns={columns}
				handleAddItem={() => handleOpenDialog("addEmployee")}
				handleRemoveItem={() => handleOpenDialog("removeEmployee")}
				pageSizeOptions={[5, 10, 15]}
				initialPageSize={5}
			/>

			<FormDialog
				open={activeDialog === "addEmployee"}
				form={<AddEmployeeForm />}
				modalTitle="Add an employee"
				menuText="Add an existing user account as an employee!"
				handleClose={handleCloseDialog}
				// Make it so button doesn't show up,
				// also don't need handleOpen because we aren't showing/having the button
				hidden={true}
			/>

			{/* 
      If we pass 'openRemoveEmployee' to 'open', our component will render regardless, 
      even if its invisible, the calculations will be done. We set it up so that 
      when 'openRemoveEmployee' is true, they have selected a 'user' or row. So then targetUser
      exists, and we only have to do this calculation when the boolean is true.     
      */}
			{activeDialog === "removeEmployee" && (
				<RemoveEmployeeDialog
					open={true}
					handleClose={() => handleCloseDialog("removeEmployee")}
					targetUser={state.employees.find((e) => e._id === selectedRowID)}
				/>
			)}
		</Box>
	);
}

const columns = [
	{ field: "id", headerName: "ID" },
	{
		field: "avatar",
		headerName: "Avatar",
		width: 100,
		renderCell: ({ row }) => (
			<Avatar alt="Avatar" src={row.avatarSrc}>
				{row.avatarInitials}
			</Avatar>
		),
	},
	{ field: "username", headerName: "Username", width: 125, editable: true },
	{ field: "email", headerName: "Email", width: 180, editable: true },
	{ field: "fullName", headerName: "Name", width: 180, editable: true },
	{
		field: "role",
		headerName: "Role",
		width: 100,
		editable: true,
		type: "singleSelect", // by the way this is how we do a select drop down. as a field.

		valueOptions: ["Admin", "Editor", "User"],

		// Convert numerical roles to human readable roles for the data grid.
		valueGetter: ({ row }) => getRoleString(row.role),
	},
	/*
  - 'lastLogin' should be a date string in ISO 8601 format in UTC time. 
    Then we have to convert this into a JS date object for MUI. Then
    JS Date object handles the time zone conversion when we create 
    a date object from a UTC ISO 8601 string. As a result, the lastLogin
    will show the time relative to the user's timezones.
  */
	{
		field: "lastLogin",
		headerName: "Last Login",
		type: "dateTime",
		width: 180,
		valueGetter: ({ row }) => {
			return new Date(row.lastLogin);
		},
	},
];
