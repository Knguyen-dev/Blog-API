import {
	Avatar,
	Typography,
	Button,
	Container,
	Box,
	Divider,
} from "@mui/material";

import useAuthContext from "../../../hooks/useAuthContext";
import useLogout from "../../../hooks/useLogout";

// Import dialogs for editing various aspects of a user profile
import EditAvatarDialog from "./components/EditAvatarDialog";
import EditUsernameDialog from "./components/EditUsernameDialog";
import EditEmailDialog from "./components/EditEmailDialog";
import EditFullNameDialog from "./components/EditFullNameDialog";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import DeleteAccountDialog from "./components/DeleteAccountDialog";

export default function ProfilePage() {
	const { auth } = useAuthContext();
	const logout = useLogout();

	return (
		<Container maxWidth="md">
			{/* Avatar Section: Edit avatar*/}
			<Box
				component="section"
				className="tw-flex xs:max-sm:tw-flex-col tw-items-center tw-justify-center tw-gap-x-5">
				<Avatar
					className="tw-h-20 tw-w-20 xs:max-sm:tw-mb-1 tw-text-4xl"
					src={auth.user.avatarSrc}
					alt="">
					{auth.user.avatarInitials}
				</Avatar>
				<Box className="tw-flex tw-flex-col tw-items-center tw-gap-y-1">
					<Typography variant="h5">{auth.user.fullName}</Typography>
					<EditAvatarDialog user={auth.user} />
				</Box>
			</Box>
			<Divider className="tw-my-5" />
			{/* My Account Section: Username, email, and full name  */}
			<Box component="section">
				<header className="tw-mb-3">
					<Typography variant="h4">My account</Typography>
				</header>

				<Box className="tw-flex tw-flex-col tw-gap-y-4">
					<Box>
						<Box className="tw-flex tw-justify-between tw-items-center">
							<Typography className="tw-font-bold">Username</Typography>
							<EditUsernameDialog username={auth.user.username} />
						</Box>
						<Typography>{auth.user.username}</Typography>
					</Box>

					<Box>
						<Box className="tw-flex tw-justify-between tw-items-center">
							<Typography className="tw-font-bold">Email</Typography>
							<EditEmailDialog email={auth.user.email} />
						</Box>
						<Typography> {auth.user.email} </Typography>
					</Box>

					<Box>
						<Box className="tw-flex tw-justify-between tw-items-center">
							<Typography className="tw-font-bold">Name</Typography>
							<EditFullNameDialog fullName={auth.user.fullName} />
						</Box>
						<Typography>{auth.user.fullName} </Typography>
					</Box>
				</Box>
			</Box>
			<Divider className="tw-my-5" />
			{/* Authentication & Security: Changing Password and logging out. Note that we 
          shouldn't need to pass handleCloseDialog to onSuccess to changing password and account deletion forms 
          because successful submissions will redirect the user to the login screen. */}
			<Box component="section">
				<header className="tw-mb-3">
					<Typography variant="h4">Authentication & Security</Typography>
				</header>
				<Box>
					<ChangePasswordDialog />
					<Button
						variant="outlined"
						color="info"
						className="tw-mt-2"
						onClick={logout}>
						Sign out
					</Button>
				</Box>
			</Box>
			<Divider className="tw-my-5" />
			{/* Account removal: Delete acccount */}
			<Box component="section">
				<header className="tw-mb-3">
					<Typography variant="h4">Account Removal</Typography>
				</header>
				<Box>
					<DeleteAccountDialog />
				</Box>
			</Box>
		</Container>
	);
}
