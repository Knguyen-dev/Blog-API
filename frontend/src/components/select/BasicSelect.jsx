import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";

/*
+ BasicSelect: Basic dropdown select that allows users to pick from certain options.

- NOTE: You also want to keep the 'value' defined, so that the mui select
  component is controlled. 
  Credit: https://stackoverflow.com/questions/47012169/a-component-is-changing-an-uncontrolled-input-of-type-text-to-be-controlled-erro

*/

export default function BasicSelect({
	label,
	options,
	value,
	setValue,
	placeholder,
}) {
	const handleChange = (event) => {
		setValue(event.target.value);
	};

	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">{label}</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={value}
					label={label}
					onChange={handleChange}>
					<MenuItem value="" disabled>
						{placeholder}
					</MenuItem>
					{options.map((item) => {
						return (
							<MenuItem key={item.id} value={item.value}>
								{item.title}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
		</Box>
	);
}
BasicSelect.propTypes = {
	label: PropTypes.string,
	options: PropTypes.array,
	value: PropTypes.string,
	setValue: PropTypes.func,
	placeholder: PropTypes.string,
};
