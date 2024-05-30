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

id : username
1 : Kevin12
2 : John209

index : name
0 : "Jaems"
1 : "Ryan"
2 : "Conan"
3 : "Aleks"

However, to be able to make things flexible like this, we should be able 
to pass in functions such as getOptionLabel and getOptionValue to decide how the 
label and value should be calculated from our options array. 

Ex. 1:
options = [
  {
    id: 1
    title: 'MyTitle' 
  },
  {
    id: 2
    title: 'MyTitle' 
  },
]
*/

interface NewBasicSelectProps {
	value: string;
	setValue: (newValue: string) => void;
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
	setValue,
	label,
	options,
	getOptionLabel,
	getOptionValue,
	placeholder = "None",
	required, // gives us that asterisks for required form controls
	allowNone = false, // determines whether or not the user can select 'none' as an option
}: NewBasicSelectProps) {
	const handleChange = (event: SelectChangeEvent) => {
		setValue(event.target.value);
	};

	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl fullWidth required={required}>
				<InputLabel id="demo-simple-select-label">{label}</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={value}
					label={label}
					onChange={handleChange}>
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
