/* eslint-disable @typescript-eslint/no-explicit-any */
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
  GridToolbarProps,
  GridRowModesModel,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import {
  useState,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
  MouseEvent,
  FocusEvent,
} from "react";
import { Box, Button } from "@mui/material";
import CustomNoRowsOverlay from "./CustomNoRowsOverlay";

const DEFAULTS = {
  pageSizeOptions: [5, 10, 15],
  initialPageSize: 5,
};

interface ICustomToolbarProps extends GridToolbarProps {
  selectedRowID?: string;
  rowMode: string;
  rowModesModel: GridRowModesModel;
  setRowModesModel: Dispatch<SetStateAction<GridRowModesModel>>;
  handleAddItem: () => void;
  handleRemoveItem: () => void;
}

interface IEditSelectGridProps {
  selectedRowID?: string;
  setSelectedRowID: Dispatch<SetStateAction<string | undefined>>;
  rows: any[];
  getRowId: (row: any) => string | number;
  processRowUpdate: (newRow: any, oldRow: any) => any;
  handleRowUpdateError: (error: any) => void;
  columns: any[];
  handleAddItem: () => void;
  handleRemoveItem: () => void;
  pageSizeOptions?: number[];
  initialPageSize?: number;
}

/**
 * CustomToolbar Component
 *
 * Provides a toolbar with buttons to add, remove, edit, save, and cancel row operations.
 */
function CustomToolbar({
  rowMode,
  selectedRowID,
  rowModesModel,
  setRowModesModel,
  handleAddItem,
  handleRemoveItem,
}: ICustomToolbarProps) {
  /*
  + Handles triggering our 'processUpdateRow' function in our main component.
	So for this to happen, we switch that particular row back to 'view' mode.
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
    // This prevents the state for that row being updated by the data-grid
    setRowModesModel({
      ...rowModesModel,
      [selectedRowID]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  // Keep the focus on the 'cell'
  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <GridToolbarContainer>
      <Box sx={{ marginBottom: 1 }}>
        <Box sx={{ display: "flex", columnGap: 1, marginBottom: 1 }}>
          {/* Add item button */}
          <Button
            variant="outlined"
            onMouseDown={handleMouseDown}
            onClick={handleAddItem}>
            Add
          </Button>

          {/* Remove item button; can't be clicked if a row isn't selected */}
          <Button
            variant="outlined"
            onMouseDown={handleMouseDown}
            color="warning"
            disabled={!selectedRowID}
            onClick={handleRemoveItem}>
            Remove
          </Button>

          {/* Edit or save item button; can't be clicked if a row isn't selected. Then depending on our rowMode 
						value, we can either delete or save it. */}
          <Button
            variant="outlined"
            onMouseDown={handleMouseDown}
            disabled={!selectedRowID}
            onClick={rowMode === "edit" ? handleSave : handleEdit}>
            {rowMode === "edit" ? "Save" : "Edit"}
          </Button>

          {/* Cancel edit item button; disabled when our mode is 'view' because you can't cancel when you're already in 'view' */}
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
    </GridToolbarContainer>
  );
}

/**
 * EditSelectGrid Component
 *
 * A data grid component that allows for editing and selecting rows.
 * It includes custom toolbar for adding, removing, editing, saving, and canceling row operations.
 */
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
}: IEditSelectGridProps) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // Handlw row focus event to set the selectedRowID state
  const handleRowFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget;
      const id = row.dataset.id;
      setSelectedRowID(id);
    },
    [setSelectedRowID]
  );

  // Determine current row mode based on selectedRowID and rowModesModel
  const rowMode = useMemo(() => {
    if (!selectedRowID) {
      return "view";
    }
    return rowModesModel[selectedRowID]?.mode || "view";
  }, [rowModesModel, selectedRowID]);

  // Prevents us from exiting edit due to clicking out.
  const handleRowEditStop = useCallback((params: any, event: any) => {
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
          toolbar: CustomToolbar as any,
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
