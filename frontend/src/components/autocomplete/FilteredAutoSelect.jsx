import { Autocomplete, TextField } from "@mui/material";

import PropTypes from "prop-types";

/*
+ FilteredAutoSelect: A multi-select autocomplete for mui. It shows available optiosn
  and forces the user to pick one of those options. As well as this it creates chips
  to display which options are already picked.

- onChange: Triggered when a tag is added or removed. So if you want to have this controlled
  you need to just pass in a state setting function. Note that e.target.value doesn't 
  give you the value of your 'option', that was never in the question, but rather the 
  index position of that option which is located as a data-attribute.
*/

FilteredAutoSelect.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,

	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		})
	),

	selectedValues: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		})
	),
	setSelectedValues: PropTypes.func,
	getOptionLabel: PropTypes.func,
	isOptionEqualToValue: PropTypes.func,
	limitTags: PropTypes.number,
};

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
}) {
	const handleTagsChange = (event, newValues) => {
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
