import {
	Box,
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	SelectChangeEvent,
} from "@mui/material";

/*
+ NewBasicSelect: A select drop down component that's supposed to be controlled by a state
We can think of NewBasicSelect as a glorified map or dictionary. Where the 
keys we enter are the 'value' parameter, and the value of the dictionary. 
By setting the 'id', value, then we will display the appropriate output (username).


*/

interface NewBasicSelectProps {
	value: string;
	onChange: (event: SelectChangeEvent) => void;
	label?: string;
	options: any[];
	placeholder?: string;
	getOptionLabel: (option: any) => string;
	getOptionValue: (option: any) => string;
	required?: boolean;
	allowNone?: boolean;
}

export default function NewBasicSelect({
	value,
	onChange,
	label,
	options,
	getOptionLabel,
	getOptionValue,
	placeholder = "None",
	required, // gives us that asterisks for required form controls
	allowNone = false, // determines whether or not the user can select 'none' as an option
}: NewBasicSelectProps) {
	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl fullWidth required={required}>
				<InputLabel id="demo-simple-select-label">{label}</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={value}
					label={label}
					onChange={onChange}>
					{/* If allowNone, render this disabled menu item as placeholder */}
					{allowNone && (
						<MenuItem value="" disabled={true} aria-disabled={true}>
							<em>{placeholder}</em>
						</MenuItem>
					)}

					{options.map((option, index) => (
						// On click, the value is the entire option object.
						<MenuItem key={index} value={getOptionValue(option)}>
							{getOptionLabel(option)}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}
