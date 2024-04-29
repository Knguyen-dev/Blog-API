import {
	Typography,
	Fab,
	Grid,
	Tooltip,
	Button,
	Divider,
	Box,
	Link,
} from "@mui/material";
import ContrastIcon from "@mui/icons-material/Contrast";
import AccountMenu from "./menus/AccountMenu";
import useAuthContext from "../hooks/useAuthContext";
import useColorContext from "../hooks/useColorContext";
import { styled, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // Import Link from react-router-dom

const CustomHeader = styled("header")(({ theme }) => ({
	backgroundColor: theme.palette.headerBg,
}));

export default function Header() {
	const { auth } = useAuthContext();
	const { preferences, toggleColorMode } = useColorContext();
	const navigate = useNavigate();
	const theme = useTheme();

	return (
		<CustomHeader className="tw-pt-2 tw-px-5">
			<Grid container className="tw-items-center">
				<Grid item xs={12} md={3} className="xs:max-md:tw-mb-4">
					<Box className="xs:max-md:tw-text-center">
						<Typography variant="h4">
							<Link
								component="button"
								style={{ color: theme.palette.brandColor }}
								underline="none"
								onClick={() => navigate("/browse")}>
								Blog Sphere
							</Link>
						</Typography>
					</Box>
				</Grid>

				<Grid item xs={10} md={5} className="tw-mx-auto xs:max-md:tw-mb-2">
					<Box className="tw-list-none tw-flex xs:max-sm:tw-flex-col tw-items-center tw-justify-evenly tw-gap-2">
						<li>
							<Link
								component="button"
								style={{ color: theme.palette.brandColor }}
								underline="none"
								onClick={() => navigate("/home")}>
								Home
							</Link>
						</li>
						<li>
							<Link
								component="button"
								style={{ color: theme.palette.brandColor }}
								underline="none"
								onClick={() => navigate("/about")}>
								About
							</Link>
						</li>
						<li>
							<Link
								component="button"
								style={{ color: theme.palette.brandColor }}
								underline="none"
								onClick={() => navigate("/projects")}>
								Projects
							</Link>
						</li>
						<li>
							<Link
								component="button"
								style={{ color: theme.palette.brandColor }}
								underline="none"
								onClick={() => navigate("/browse")}>
								Blog
							</Link>
						</li>
						<li>
							<Link
								component="button"
								style={{ color: theme.palette.brandColor }}
								underline="none"
								onClick={() => navigate("/contact")}>
								Contact
							</Link>
						</li>
					</Box>
				</Grid>

				<Grid item xs={12} md={4}>
					<div className="tw-flex xs:max-md:tw-justify-center tw-justify-end tw-items-center tw-gap-x-6">
						{/* If authenticated render the menu, else redner sign in button */}
						<Tooltip
							title={`Appearance: ${preferences.darkMode ? "Dark" : "Light"}`}>
							<Fab size="small" onClick={toggleColorMode}>
								<ContrastIcon />
							</Fab>
						</Tooltip>

						{auth.user ? (
							<AccountMenu user={auth.user} />
						) : (
							<Button
								variant="outlined"
								onClick={() => navigate("/auth/login")}>
								Sign In
							</Button>
						)}
					</div>
				</Grid>
			</Grid>

			<Divider className="tw-mt-2" />
		</CustomHeader>
	);
}
