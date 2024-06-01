import { Box, Avatar } from "@mui/material";
import { useEffect, useCallback, useState } from "react";
import EditSelectGrid from "../../components/EditSelectGrid";
import AddEmployeeDialog from "./AddEmployeeDialog";
import RemoveEmployeeDialog from "./RemoveEmployeeDialog";
import useEmployeeContext from "../hooks/useEmployeeContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { employeeActions } from "../data/employeeConstants";
import { getRoleNumber, getRoleString } from "../utils/roleUtilities";
import useToast from "../../../../hooks/useToast";
import getErrorData from "../../../../utils/getErrorData";
import { IUser } from "../../../../types/Post";





export default function EmployeeGrid() {
	const { state, dispatch } = useEmployeeContext();
	const { showToast } = useToast();
	const axiosPrivate = useAxiosPrivate();

	// Represents selected user
	const [selectedRowID, setSelectedRowID] = useState<string | undefined>(undefined);

	// Represents the name of the dialog that will be active
	const [activeDialog, setActiveDialog] = useState("");

	const handleOpenDialog = (dialogName: string) => setActiveDialog(dialogName);
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
		async (newRow: IUser): Promise<IUser> => {

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

	// Handles catching/showing potential errors for processRowUpdate
	const handleRowUpdateError = useCallback(
		(err: any) => {
			let errMessage = "";
			if (err.response) {
				errMessage = getErrorData(err);
			} else if (err.request) {
				errMessage = "Network error occurred!";
			} else {
				errMessage = "Something unexpected happened!";
			}
			showToast({ message: errMessage, severity: "error" });
		},
		[showToast]
	);

	
	/*
	- Initialize a user that we want to delete. If 'activeDialog' is 'removeEmployee' that means 
	our selectedRowID is the id of the user that we want to delete. Set that userToDelete value, 
	which will cause our RemoveEmployeeDialog to render.

	NOTE: So if activeDialog is 'removeEmployee' then only the RemoveEmployeeDialog will be rendered whilst 
	the other dialog isn't. And the vice versa is true.
	*/
	let userToDelete: IUser | undefined = undefined;
	if (activeDialog === "removeEmployee") {
		userToDelete = state.employees.find((e) => e._id === selectedRowID);
	}

	return (
		<Box>
			<EditSelectGrid
				selectedRowID={selectedRowID}
				setSelectedRowID={setSelectedRowID}
				rows={state.employees}

				// Mui uses field 'id' by default. To get it to work when our id field is not '.id' 
				// we use getRowId to indicate how to get ID on a row.
				getRowId={(row) => row._id}
				processRowUpdate={processRowUpdate}
				handleRowUpdateError={handleRowUpdateError}
				columns={columns}
				handleAddItem={() => handleOpenDialog("addEmployee")}
				handleRemoveItem={() => handleOpenDialog("removeEmployee")}
				pageSizeOptions={[5, 10, 15]}
				initialPageSize={5}
			/>

			<AddEmployeeDialog
				open={activeDialog === "addEmployee"}
				handleClose={handleCloseDialog}
			/>

			{/* If userToDelete is defined, we are deleting a user so render the RemoveEmployeeDialog */}
			{userToDelete && (
				<RemoveEmployeeDialog
					open={true}
					handleClose={handleCloseDialog}
					targetUser={userToDelete}
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
		renderCell: ({ row } : {row: IUser}) => (
			<Avatar alt="Avatar" sx={{ color: "black" }} src={row.avatarSrc}>
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

		/*
    - The 'Team' grid will only show users that have role 'editor' or 'admin'. As well 
    as this, once you are an editor or admin, you cannot go back to having role 'user'. 
    Of course you can switch around being an editor or admin, but you simply can't go 
    back to being role 'user'. This helps keep strict separation on things.
    */
		valueOptions: ["Admin", "Editor"],

		// Convert numerical roles to human readable roles for the data grid.
		valueGetter: ({ row } : {row: IUser}) => row.role,

		// Display the corresponding human-readable role string for each role number
		valueFormatter: ({ roleNumber } : {roleNumber : number}) => {
			const roleString = getRoleString(roleNumber);
			return roleString;
		},
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
		valueGetter: ({ row }: {row: IUser}) => {
			if (!row.lastLogin) {
				return null;
			}

			return new Date(row.lastLogin);
		},
		
		// Manipulate/render the date object created from lastLogin
		valueFormatter: ({ lastLogin } : {lastLogin: Date}) => {
			if (!lastLogin) {
				return "User hasn't logged in yet!";
			}
			return lastLogin;
		},
	},
];
