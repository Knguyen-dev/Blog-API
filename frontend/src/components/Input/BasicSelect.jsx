import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";

export default function BasicSelect({
	value,
	setValue,
	label,
	options,
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
					<MenuItem disabled value={null}>
						<em>{placeholder}</em>
					</MenuItem>

					{options.map((option, index) => (
						<MenuItem key={index} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}
BasicSelect.propTypes = {
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	setValue: PropTypes.func,
	label: PropTypes.string,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		})
	),
	placeholder: PropTypes.string,
};
