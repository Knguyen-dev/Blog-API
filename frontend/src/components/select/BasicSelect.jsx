import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import PropTypes from "prop-types";

export default function BasicSelect({ label, itemList }) {
	const [value, setValue] = useState("");

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">Age</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={value}
					label={label}
					onChange={handleChange}>
					{itemList.map((item) => {
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
	itemList: PropTypes.array,
};
