import {
	Autocomplete,
	TextField,
	AutocompleteChangeReason,
	AutocompleteChangeDetails,
} from "@mui/material";
import { SyntheticEvent } from "react";
interface IBasicAutoProps<T> {
	options: T[];
	onChange: (
		event: SyntheticEvent<Element, Event>,
		value: T | null,
		reason: AutocompleteChangeReason,
		details?: AutocompleteChangeDetails<T> | undefined
	) => void;
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
}: IBasicAutoProps<T>) {
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
