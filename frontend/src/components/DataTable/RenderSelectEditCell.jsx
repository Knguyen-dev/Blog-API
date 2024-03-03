/*
+ Key ideas: 
1. Pass in our custom edit component into renderEditCell. We'll get 'value' 
  which is the current value of the cell in edit mode. THen 'error' which 
  is the error we may get during validation. Then 'isProcessingProps' which 
  is whether 'preProcessEditCellProps' is being run or not.

2. We must pass the 'row ID', column field, and new cell value to the 
  datagrid. We pass these values to apiRef.current.setEditCellValue to do this.
  This parses and validates the new cell value.

3. For accessibility, during edit mode the element must be focused. So 
  we make hasFocus prop true on the cell in edit mode.

4. By default each call to apiRef.current.setEditCellValue triggers a new render.
  If we're re-rendering too often, such as when a user types in a new value, our 
  stuff will slow down. To help mitigate this, use debouncing. Debouncing is a technique
  in software development, where we control the rate at which a function is executed. 
  We delaying the invocation of a function until some time has passed since the last 
  invocation. As a result, no matter how many times our api method is called, data grid
  is only re-render after our set period of time is passed.

  - Now our value prop won't be updated on each 'apiRef' call because our data
    grid is only set to re-render about our 200ms. To prevent this frozen UI,
    we make it so the edit component keeps the current value in an 'internal state'
    and synchronizes up once 'value' changes. 

5. 'auto-stop': With autostop, we stop edit mode when the value is changed. For 
  example, after selecting a value from the dropdown, we confirmed the value to be 
  changed. Use 'apiRef.current.stopCellEditMode' after we set the new value. Also 
  it's just good prcatice to check if 'apiRef.current.setEditCellValue' is true. 
  This is because it will be false when 'preProcessEditProps' had an error for 
  our value validation, which is important when you do input validation for 
  the data grid! This is why we do 'isValid' and await which represents 
  us changing the stuff on the backend. 
  
*/

import { useGridApiContext } from "@mui/x-data-grid";
import { Select } from "@mui/material";
import PropTypes from "prop-types";

function SelectEditCell({ options }) {
	const { id, value, field } = props;
	const apiRef = useGridApiContext();

	const handleChange = async (event) => {
		await apiRef.current.setEditCellValue({
			id,
			field,
			value: event.target.value,
		});
		apiRef.current.stopCellEditMode({ id, field });
	};

	return (
		<Select
			value={value}
			onChange={handleChange}
			size="small"
			sx={{ height: 1 }}
			native
			autoFocus>
			{/* Pass in props to render these */}
			<option>Back-end Developer</option>
			<option>Front-end Developer</option>
			<option>UX Designer</option>
		</Select>
	);
}

export default function RenderSelectEditCell(params) {
	return <SelectEditCell {...params} />;
}

SelectEditCell.propTypes = {
	id: PropTypes.string,
	value: PropTypes.string,
	field: PropTypes.string,
	options: PropTypes.array,
};
