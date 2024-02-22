import {
	Avatar,
	Typography,
	Button,
	Container,
	Box,
	Divider,
} from "@mui/material";
import { useState } from "react";

import useAuthContext from "../../hooks/useAuthContext";
import useLogout from "../../hooks/useLogout";

import FormDialog from "../../components/dialog/FormDialog";
import AvatarForm from "../../components/forms/AvatarForm";

import EditProfileForm from "../../components/forms/EditProfileForm";
import ChangePasswordForm from "../../components/forms/ChangePasswordForm";

export default function ProfilePage() {
	const { auth } = useAuthContext();
	const logout = useLogout();

	const [editProfile, setEditProfile] = useState(false); // for displaying and hiding edit profile form
	const [changePassword, setChangePassword] = useState(false); // for displaying and hiding change password form

	const [open, setOpen] = useState(false); // For triggering formDialog (modal) on the avatar form
	const handleOpen = () => setOpen(true); // For opening and closing avatar form modal
	const handleClose = () => setOpen(false);

	return (
		<div className="tw-flex tw-flex-col tw-gap-y-5">
			<Container maxWidth="sm">
				{/* Avatar Section*/}
				<Box className="tw-flex xs:max-sm:tw-flex-col tw-items-center tw-justify-center tw-gap-x-5">
					<Avatar
						sx={{
							width: 75,
							height: 75,
							fontSize: 48,

							// Margin bottom on extra small screens, but nothing on small and above
							marginBottom: { xs: 2, sm: 0 },
						}}
						src={auth.user.avatarSrc}>
						{auth.user.avatarInitials}
					</Avatar>
					<div className="tw-flex tw-flex-col">
						<Typography variant="h5">{auth.user.fullName}</Typography>
						<Button
							variant="outlined"
							className="tw-mt-2 tw-self-center"
							onClick={handleOpen}>
							Edit Avatar
						</Button>
					</div>
				</Box>
				<Divider className="tw-my-5" />
				{/* My Account Section: Username, email, and full name  */}
				<Box>
					<header className="tw-mb-3">
						<Typography variant="h4">My account</Typography>
					</header>

					<main className="tw-flex tw-flex-col tw-gap-y-2">
						{editProfile ? (
							// If user is editing their profile
							<EditProfileForm
								username={auth.user.username}
								email={auth.user.email}
								name={auth.user.fullName}
								handleCloseForm={() => setEditProfile(false)}
							/>
						) : (
							// Else display all action buttons and info for this section
							<Box>
								<Box className="tw-mb-5">
									<Typography>Username: {auth.user.username} </Typography>
									<Typography>Email: {auth.user.email}</Typography>
									<Typography>Full Name: {auth.user.fullName}</Typography>
								</Box>

								<Button
									variant="outlined"
									className="tw-self-start"
									onClick={() => setEditProfile(true)}>
									Edit
								</Button>
							</Box>
						)}
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
							{/* If user is changing password, then display the form */}
							{changePassword ? (
								<ChangePasswordForm
									handleCloseForm={() => setChangePassword(false)}
								/>
							) : (
								// Else display all available action buttons in this section
								<Box className="tw-flex tw-flex-col tw-items-start tw-gap-y-2">
									<Button
										variant="outlined"
										className="tw-self-start"
										onClick={() => setChangePassword(true)}>
										Change Password
									</Button>
									<Button variant="outlined" color="info" onClick={logout}>
										Sign out
									</Button>
								</Box>
							)}
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
						<Button variant="outlined" color="warning">
							Delete Account
						</Button>
					</main>
				</Box>
			</Container>

			<FormDialog open={open} handleClose={handleClose}>
				<AvatarForm />
			</FormDialog>
		</div>
	);
}
