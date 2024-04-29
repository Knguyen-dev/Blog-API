import { Autocomplete, TextField } from "@mui/material";
import PropTypes from "prop-types";

BasicAuto.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		})
	),
	onChange: PropTypes.func,
	value: PropTypes.shape({
		label: PropTypes.string,
		value: PropTypes.string,
	}),
	label: PropTypes.string,
	isOptionEqualToValue: PropTypes.func,
};

export default function BasicAuto({
	options,
	onChange,
	value,
	label,
	isOptionEqualToValue,
}) {
	return (
		<Autocomplete
			disablePortal
			id="combo-box-demo"
			options={options}
			getOptionLabel={(option) => option.label}
			onChange={onChange}
			// If value has keys, then return value, else nothing was picked so default to options[0]
			value={value}
			renderInput={(params) => <TextField {...params} label={label} />}
			isOptionEqualToValue={isOptionEqualToValue}
		/>
	);
}
