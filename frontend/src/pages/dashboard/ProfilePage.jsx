import {
	Avatar,
	Typography,
	Button,
	Container,
	Box,
	Divider,
} from "@mui/material";

import useAuthContext from "../../hooks/user/useAuthContext";
import useLogout from "../../hooks/user/useLogout";

import EditAvatarDialog from "../../components/dialog/EditAvatarDialog";
import EditEmailDialog from "../../components/dialog/EditEmailDialog";
import EditFullNameDialog from "../../components/dialog/EditFullNameDialog";
import EditUsernameDialog from "../../components/dialog/EditUsernameDialog";
import ChangePasswordDialog from "../../components/dialog/ChangePasswordDialog";
import DeleteAccountDialog from "../../components/dialog/DeleteAccountDialog";

export default function ProfilePage() {
	const { auth } = useAuthContext();
	const logout = useLogout();

	return (
		<div className="tw-flex tw-flex-col tw-gap-y-5">
			<Container maxWidth="sm">
				{/* Avatar Section: Edit avatar*/}
				<Box className="tw-flex xs:max-sm:tw-flex-col tw-items-center tw-justify-center tw-gap-x-5">
					<Avatar
						className="tw-h-20 tw-w-20 xs:max-sm:tw-mb-1 tw-text-4xl"
						src={auth.user.avatarSrc}>
						{auth.user.avatarInitials}
					</Avatar>
					<div className="tw-flex tw-flex-col tw-items-center tw-gap-y-1">
						<Typography variant="h5">{auth.user.fullName}</Typography>
						<EditAvatarDialog user={auth.user} />
					</div>
				</Box>
				<Divider className="tw-my-5" />
				{/* My Account Section: Username, email, and full name  */}
				<Box>
					<header className="tw-mb-3">
						<Typography variant="h4">My account</Typography>
					</header>

					<main className="tw-flex tw-flex-col tw-gap-y-4">
						<Box>
							<Box className="tw-flex tw-justify-between tw-items-center">
								<Typography className="tw-font-bold">Username</Typography>
								<EditUsernameDialog user={auth.user} />
							</Box>
							<Typography>{auth.user.username}</Typography>
						</Box>

						<Box>
							<Box className="tw-flex tw-justify-between tw-items-center">
								<Typography className="tw-font-bold">Email</Typography>
								<EditEmailDialog user={auth.user} />
							</Box>
							<Typography> {auth.user.email} </Typography>
						</Box>

						<Box>
							<Box className="tw-flex tw-justify-between tw-items-center">
								<Typography className="tw-font-bold">Name</Typography>
								<EditFullNameDialog user={auth.user} />
							</Box>
							<Typography> {auth.user.fullName} </Typography>
						</Box>
					</main>
				</Box>
				<Divider className="tw-my-5" />
				{/* Authentication & Security: Changing Password and logging out */}
				<Box>
					<header className="tw-mb-3">
						<Typography variant="h4">Authentication & Security</Typography>
					</header>
					<main>
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
					</main>
				</Box>
				<Divider className="tw-my-5" />
				{/* Account removal: Delete acccount */}
				<Box>
					<header className="tw-mb-3">
						<Typography variant="h4">Account Removal</Typography>
					</header>
					<main>
						<DeleteAccountDialog />
					</main>
				</Box>
			</Container>
		</div>
	);
}
