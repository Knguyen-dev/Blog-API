import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function DataTable({
	rows,
	columns,
	processRowUpdate,
	onProcessRowUpdateError,
	slotProps,
}) {
	return (
		<DataGrid
			rows={rows}
			columns={columns}
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
	processRowUpdate: PropTypes.func,
	onProcessRowUpdateError: PropTypes.func,
	slotProps: PropTypes.object,
};
