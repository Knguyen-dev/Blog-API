import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function DataTable({
	rows,
	columns,
	columnVisibilityModel,
	onColumnVisibilityModelChange,
	processRowUpdate,
	onProcessRowUpdateError,
	slotProps,
}) {
	return (
		<DataGrid
			rows={rows}
			columns={columns}
			columnVisibilityModel={columnVisibilityModel}
			onColumnVisibilityModelChange={onColumnVisibilityModelChange}
			processRowUpdate={processRowUpdate}
			onProcessRowUpdateError={onProcessRowUpdateError}
			slots={{ toolbar: GridToolbar }}
			slotProps={slotProps}
		/>
	);
}
DataTable.propTypes = {
	rows: PropTypes.array,
	columns: PropTypes.array,
	columnVisibilityModel: PropTypes.object,
	onColumnVisibilityModelChange: PropTypes.func,
	processRowUpdate: PropTypes.func,
	onProcessRowUpdateError: PropTypes.func,
	slotProps: PropTypes.object,
};
