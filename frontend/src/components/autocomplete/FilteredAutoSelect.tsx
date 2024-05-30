import { Autocomplete, TextField } from "@mui/material";

/*
+ FilteredAutoSelect: A multi-select autocomplete for mui. It shows available optiosn
  and forces the user to pick one of those options. As well as this it creates chips
  to display which options are already picked.

- onChange: Triggered when a tag is added or removed. So if you want to have this controlled
  you need to just pass in a state setting function. Note that e.target.value doesn't 
  give you the value of your 'option', that was never in the question, but rather the 
  index position of that option which is located as a data-attribute.
*/
interface Option {
	label: string;
	value: string;
}

interface FilteredAutoSelectProps {
	id?: string;
	label?: string;
	placeholder?: string;
	options: Option[];
	selectedValues: Option[];
	setSelectedValues: (newValues: Option[] | null) => void;
	getOptionLabel: (option: Option) => string;
	isOptionEqualToValue: (option: Option, value: Option) => boolean;
	limitTags?: number;
}

export default function FilteredAutoSelect({
	id,
	label,
	placeholder,
	options,
	selectedValues,
	setSelectedValues,
	getOptionLabel,
	isOptionEqualToValue,
	limitTags,
}: FilteredAutoSelectProps) {
	const handleTagsChange = (
		event: React.ChangeEvent<{}>,
		newValues: Option[] | null
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
			onChange={handleTagsChange}
			renderInput={(params) => (
				<TextField {...params} label={label} placeholder={placeholder} />
			)}
			filterSelectedOptions
		/>
	);
}
