import PropTypes from "prop-types";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
export default function SearchBar({ onSubmit }) {
	return (
		<form onSubmit={onSubmit}>
			<label
				htmlFor="default-search"
				className="tw-sr-only tw-text-sm tw-font-medium tw-text-gray-900 tw-dark:text-white">
				Search
			</label>
			<div className="tw-relative">
				<div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-start-0 tw-flex tw-items-center tw-ps-3">
					<SearchIcon />
				</div>
				<input
					type="search"
					id="default-search"
					className="tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-bg-gray-50 tw-p-4 tw-ps-10 tw-text-sm tw-text-gray-900 tw-focus:border-blue-500 tw-focus:ring-blue-500 tw-dark:border-gray-600 tw-dark:bg-gray-700 tw-dark:text-white tw-dark:placeholder-gray-400 tw-dark:focus:border-blue-500 tw-dark:focus:ring-blue-500"
					placeholder="Search Mockups, Logos..."
					required
				/>

				<Button
					type="submit"
					variant="contained"
					className="tw-absolute tw-bottom-2.5 tw-end-2.5">
					Search
				</Button>
			</div>
		</form>
	);
}

SearchBar.propTypes = {
	onSubmit: PropTypes.func,
};
