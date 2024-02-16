import { Typography, Fab, Grid, Tooltip, Button } from "@mui/material";
import SearchBar from "./Input/SearchBar";

import ContrastIcon from "@mui/icons-material/Contrast";

import AccountMenu from "./menus/AccountMenu";

import useAuthContext from "../hooks/useAuthContext";

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Header() {
	const { auth } = useAuthContext();
	const navigate = useNavigate();

	return (
		<header className="tw-py-2 tw-px-5">
			<Grid container className="tw-items-center">
				<Grid item xs={12} md={3} className="xs:max-md:tw-mb-4">
					<div className="xs:max-md:tw-text-center">
						<Typography variant="h4">Blog Sphere</Typography>
					</div>
				</Grid>

				<Grid item xs={10} md={5} className="tw-mx-auto">
					<SearchBar />
				</Grid>

				<Grid item xs={10} md={4}>
					<ul className="tw-flex xs:max-md:tw-justify-center tw-justify-end tw-items-center tw-gap-x-6">
						{/* If authenticated render the menu, else redner sign in button */}
						<Tooltip title="Appearance">
							<Fab size="small">
								<ContrastIcon />
							</Fab>
						</Tooltip>

						{auth ? (
							<AccountMenu user={auth.user} />
						) : (
							<Button
								variant="outlined"
								onClick={() => navigate("/auth/login")}>
								Sign In
							</Button>
						)}
					</ul>
				</Grid>
			</Grid>
		</header>
	);
}

Header.propTypes = {
	setDesktopOpen: PropTypes.func,
};
