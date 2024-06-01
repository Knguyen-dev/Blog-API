import { Autocomplete, TextField } from "@mui/material";

interface BasicAutoProps<T> {
	options: T[];
	onChange: (event: React.ChangeEvent<{}>, value: T | null) => void;
	getOptionLabel: (option: T) => string;
	label: string;
	isOptionEqualToValue: (option: T, value: T) => boolean;
	value: T | null | undefined;
	required: boolean;
}

export default function BasicAuto<T>({
	options,
	onChange,
	getOptionLabel,
	value,
	label,
	isOptionEqualToValue,
	required,
}: BasicAutoProps<T>) {
	return (
		<Autocomplete
			disablePortal
			id="combo-box-demo"
			options={options}
			getOptionLabel={getOptionLabel}
			value={value}
			onChange={onChange}
			renderInput={(params) => (
				<TextField {...params} label={label} required={required} />
			)}
			isOptionEqualToValue={isOptionEqualToValue}
		/>
	);
}
