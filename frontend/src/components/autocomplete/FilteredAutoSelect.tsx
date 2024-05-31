import { Autocomplete, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
/*
+ FilteredAutoSelect: A multi-select autocomplete for mui. It shows available optiosn
  and forces the user to pick one of those options. As well as this it creates chips
  to display which options are already picked.

- onChange: Triggered when a tag is added or removed. So if you want to have this controlled
  you need to just pass in a state setting function. Note that e.target.value doesn't 
  give you the value of your 'option', that was never in the question, but rather the 
  index position of that option which is located as a data-attribute.
*/
interface FilteredAutoSelectProps<T> {
	id?: string;
	label?: string;
	placeholder?: string;
	options: T[];
	selectedValues: T[] | undefined;
	setSelectedValues: Dispatch<SetStateAction<T[] | undefined>>;
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
	setSelectedValues,
	getOptionLabel,
	isOptionEqualToValue,
	limitTags,
}: FilteredAutoSelectProps<T>) {
	const handleValuesChange = (
		event: React.ChangeEvent<{}>,
		newValues: T[] | undefined
	) => {
		setSelectedValues(newValues);
	};

	return (
		<Autocomplete
			multiple
			limitTags={limitTags}
			id={id}
			options={options}
			getOptionLabel={getOptionLabel}
			value={selectedValues}
			isOptionEqualToValue={isOptionEqualToValue}
			onChange={handleValuesChange}
			renderInput={(params) => (
				<TextField {...params} label={label} placeholder={placeholder} />
			)}
			filterSelectedOptions
		/>
	);
}
