import {
	DataGrid,
	GridRowModes,
	GridRowEditStopReasons,
	GridToolbar,
} from "@mui/x-data-grid";
import { useState, useCallback, useMemo, useEffect } from "react";

import { Box, Button, Avatar } from "@mui/material";
import CustomNoRowsOverlay from "./common/CustomNoRowsOverlay";
import PropTypes from "prop-types";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { getRoleNumber, getRoleString } from "../../utilities/roleUtilities";
import AddEmployeeDialog from "../dialog/AddEmployeeDialog";
import RemoveEmployeeDialog from "../dialog/RemoveEmployeeDialog";
import useEmployeeContext from "../../hooks/employee/useEmployeeContext";
import employeeActions from "../../constants/employeeActions";
import useToast from "../../hooks/useToast";

/*
- BOOK MARK: Working on keeping the avatar Also I'd like to test our useEffect
  to see what's happening with that. Will probably do that in our code sandbox.

  Still working on the EmployeeGrid and its complexities.

*/

function CustomToolbar(props) {
	const { rowMode, selectedRowID, rowModesModel, setRowModesModel } = props;

	/*
  + Handles triggering our 'processUpdateRow' function in our main component.
  1. Set the row mode for the selected row into 'view'. As a result this 
    will trigger our 'processRowUpdate' function in our main component.

  - NOTE: It's important that we don't have ignoreModifications because 
    if we put that, Data-grid won't call the 'processRowUpdate' function
    to prevent the changes from being saved, which actually makes sense.
  */
	const handleSave = async () => {
		if (!selectedRowID) {
			return;
		}
		setRowModesModel({
			...rowModesModel,
			[selectedRowID]: { mode: GridRowModes.View },
		});
	};

	/*
  + Handles turning a row from view mode into edit mode.
  */
	const handleEdit = () => {
		if (!selectedRowID) {
			return;
		}

		setRowModesModel({
			...rowModesModel,
			[selectedRowID]: { mode: GridRowModes.Edit },
		});
	};

	// Handles canceling an edit and leaving edit mode
	const handleCancel = () => {
		if (!selectedRowID) {
			return;
		}

		// Let selected row go back into view mode, ignore any changes made since we canceled
		setRowModesModel({
			...rowModesModel,
			[selectedRowID]: { mode: GridRowModes.View, ignoreModifications: true },
		});
	};

	// Keep the focus on the 'cell'
	const handleMouseDown = (event) => {
		event.preventDefault();
	};

	return (
		<Box sx={{ marginBottom: 1 }}>
			<Box sx={{ display: "flex", columnGap: 1, marginBottom: 1 }}>
				<AddEmployeeDialog />

				<RemoveEmployeeDialog
					disabled={rowMode === "view"}
					targetUserID={selectedRowID}
				/>

				<Button
					variant="outlined"
					onMouseDown={handleMouseDown}
					disabled={!selectedRowID}
					onClick={rowMode === "edit" ? handleSave : handleEdit}>
					{rowMode === "edit" ? "Save" : "Edit"}
				</Button>

				<Button
					variant="outlined"
					onClick={handleCancel}
					onMouseDown={handleMouseDown}
					disabled={rowMode === "view"}>
					Cancel
				</Button>
			</Box>
			<GridToolbar />
		</Box>
	);
}

CustomToolbar.propTypes = {
	selectedRowID: PropTypes.string,
	rowMode: PropTypes.string,
	rowModesModel: PropTypes.object,
	setRowModesModel: PropTypes.func,
};

export default function EmployeeGrid() {
	const { state, dispatch } = useEmployeeContext();
	const [selectedRowID, setSelectedRowID] = useState(null);
	const [rowModesModel, setRowModesModel] = useState({});
	const { showToast } = useToast();
	const axiosPrivate = useAxiosPrivate();

	/*
  + Effect: Loads all employees from our backend into the data-grid
  */
	useEffect(() => {
		const abortController = new AbortController();
		const getEmployees = async () => {
			try {
				const response = await axiosPrivate("/employees", {
					signal: abortController.signal,
				});

				// Set the employees
				dispatch({ type: employeeActions.set, payload: response.data });
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

	const handleRowFocus = useCallback((event) => {
		const row = event.currentTarget;
		const id = row.dataset.id;
		setSelectedRowID(id);
	}, []);

	const rowMode = useMemo(() => {
		if (!selectedRowID) {
			return "view";
		}
		return rowModesModel[selectedRowID]?.mode || "view";
	}, [rowModesModel, selectedRowID]);

	// Prevents us from exiting edit due to clicking out.
	const handleRowEditStop = useCallback((params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	}, []);

	/*
  - 
  1. Process row update is the basic function we use to update 
    a row. If we had our save function in toolbar, it'd only run for 
    saves that happened with the 'save' button. Any saves that happen 
    by pressing enter just wouldn't run the save function in your toolbar.
  2. Also you probably don't need to handle setting the row back to 'view' mode
    in this function because it seems like MUI handles that on its own.
  */
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

	const handleRowUpdateError = useCallback(
		(err) => {
			/*
    - Here we are expecting errors in the axios format
    + Conditional cases:
    1. if err.response: Server side error happened. For this endpoint 
      we're expecting an error message in form {message: some_error_message}.
    2. Network error
    3. Something went wrong client side when setting up the request.
    */
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
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				getRowId={(row) => row._id}
				processRowUpdate={processRowUpdate}
				onProcessRowUpdateError={handleRowUpdateError}
				rows={state.employees}
				columns={columns}
				editMode="row" // Set edit mode to 'row'
				rowModesModel={rowModesModel}
				onRowEditStop={handleRowEditStop}
				onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
				slots={{
					toolbar: CustomToolbar,
					noRowsOverlay: CustomNoRowsOverlay,
				}}
				slotProps={{
					row: {
						onFocus: handleRowFocus,
					},
					toolbar: {
						rowMode,
						selectedRowID,
						rowModesModel,
						setRowModesModel,
					},
				}}
			/>
		</div>
	);
}

// Column definitions for the data-grid
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
	{
		field: "lastLogin",
		headerName: "Last Login",
		type: "dateTime",
		width: 180,
	},
];
