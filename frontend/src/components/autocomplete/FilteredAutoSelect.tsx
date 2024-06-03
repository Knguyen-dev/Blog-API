import {
	Autocomplete,
	AutocompleteChangeReason,
	AutocompleteChangeDetails,
	TextField,
} from "@mui/material";
import { SyntheticEvent } from "react";
/*
+ FilteredAutoSelect: A multi-select autocomplete for mui. It shows available optiosn
  and forces the user to pick one of those options. As well as this it creates chips
  to display which options are already picked.

- onChange: Triggered when a tag is added or removed. So if you want to have this controlled
  you need to just pass in a state setting function. Note that e.target.value doesn't 
  give you the value of your 'option', that was never in the question, but rather the 
  index position of that option which is located as a data-attribute.
*/
interface IFilteredAutoSelectProps<T> {
	id?: string;
	label?: string;
	placeholder?: string;
	options: T[];
	selectedValues: T[] | undefined;
	onChange: (
		event: SyntheticEvent<Element, Event>,
		value: T[] | null,
		reason: AutocompleteChangeReason,
		details?: AutocompleteChangeDetails<T> | undefined
	) => void;
	getOptionLabel: (option: T) => string;
	isOptionEqualToValue: (option: T, value: T) => boolean;
	limitTags?: number;
}

export default function FilteredAutoSelect<T>({
	id,
	label,
	placeholder,
	options,
	selectedValues,
	onChange,
	getOptionLabel,
	isOptionEqualToValue,
	limitTags,
}: IFilteredAutoSelectProps<T>) {
	return (
		<Autocomplete
			multiple
			limitTags={limitTags}
			id={id}
			options={options}
			getOptionLabel={getOptionLabel}
			value={selectedValues}
			isOptionEqualToValue={isOptionEqualToValue}
			onChange={onChange}
			renderInput={(params) => (
				<TextField {...params} label={label} placeholder={placeholder} />
			)}
			filterSelectedOptions
		/>
	);
}
