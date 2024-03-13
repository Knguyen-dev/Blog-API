/*
+ EditSelectGrid: Reusable data-grid that lets you edit and select rows. It's
  based on the grid from the MUI documentation

+ Credit: https://mui.com/x/react-data-grid/editing/#controlled-model
*/

import {
	DataGrid,
	GridRowModes,
	GridRowEditStopReasons,
	GridToolbar,
} from "@mui/x-data-grid";
import { useState, useCallback, useMemo } from "react";
import { Box, Button } from "@mui/material";
import CustomNoRowsOverlay from "./CustomNoRowsOverlay";
import PropTypes from "prop-types";

const DEFAULTS = {
	pageSizeOptions: [5, 10, 15],
	initialPageSize: 5,
};

function CustomToolbar(props) {
	const {
		rowMode,
		selectedRowID,
		rowModesModel,
		setRowModesModel,
		handleAddItem,
		handleRemoveItem,
	} = props;

	/*
  + Handles triggering our 'processUpdateRow' function in our main component.
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
				{/* Add item button */}
				<Button
					variant="outlined"
					onMouseDown={handleMouseDown}
					onClick={handleAddItem}>
					Add
				</Button>

				{/* Remove item button */}
				<Button
					variant="outlined"
					onMouseDown={handleMouseDown}
					color="warning"
					disabled={!selectedRowID}
					onClick={handleRemoveItem}>
					Remove
				</Button>

				{/* Edit or save item button */}
				<Button
					variant="outlined"
					onMouseDown={handleMouseDown}
					disabled={!selectedRowID}
					onClick={rowMode === "edit" ? handleSave : handleEdit}>
					{rowMode === "edit" ? "Save" : "Edit"}
				</Button>

				{/* Cancel edit item button */}
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
	handleAddItem: PropTypes.func,
	handleRemoveItem: PropTypes.func,
};

export default function EditSelectGrid({
	selectedRowID,
	setSelectedRowID,
	rows,
	getRowId,
	processRowUpdate,
	handleRowUpdateError,
	columns,
	handleAddItem,
	handleRemoveItem,
	pageSizeOptions,
	initialPageSize,
}) {
	const [rowModesModel, setRowModesModel] = useState({});

	const handleRowFocus = useCallback(
		(event) => {
			const row = event.currentTarget;
			const id = row.dataset.id;
			setSelectedRowID(id);
		},
		[setSelectedRowID]
	);

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

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				getRowId={getRowId}
				processRowUpdate={processRowUpdate}
				onProcessRowUpdateError={handleRowUpdateError}
				rows={rows}
				columns={columns}
				editMode="row" // Set edit mode to 'row'
				rowModesModel={rowModesModel}
				onRowEditStop={handleRowEditStop}
				onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
				pageSizeOptions={pageSizeOptions || DEFAULTS.pageSizeOptions}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: initialPageSize || DEFAULTS.initialPageSize,
						},
					},
				}}
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
						handleAddItem,
						handleRemoveItem,
					},
				}}
			/>
		</div>
	);
}

EditSelectGrid.propTypes = {
	selectedRowID: PropTypes.string,
	setSelectedRowID: PropTypes.func,
	rows: PropTypes.array,
	getRowId: PropTypes.func,
	processRowUpdate: PropTypes.func,
	handleRowUpdateError: PropTypes.func,
	columns: PropTypes.array,
	handleAddItem: PropTypes.func,
	handleRemoveItem: PropTypes.func,
	pageSizeOptions: PropTypes.array,
	initialPageSize: PropTypes.number,
};
