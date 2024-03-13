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
			label: PropTypes.string.isRequired,
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
				.isRequired,
		})
	).isRequired,
	selectedValues: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		})
	),
	setSelectedValues: PropTypes.func,
};

export default function FilteredAutoSelect({
	id,
	label,
	placeholder,
	options,
	selectedValues,
	setSelectedValues,
}) {
	const handleTagsChange = (event, newValues) => {
		setSelectedValues(newValues);
	};

	return (
		<Autocomplete
			multiple
			id={id}
			options={options}
			getOptionLabel={(option) => option.label}
			value={selectedValues}
			isOptionEqualToValue={(option, value) => option.value === value.value}
			filterSelectedOptions
			onChange={handleTagsChange}
			renderInput={(params) => (
				<TextField {...params} label={label} placeholder={placeholder} />
			)}
		/>
	);
}
