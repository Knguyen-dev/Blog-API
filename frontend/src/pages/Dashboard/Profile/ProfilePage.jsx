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

// Dialog component
import FormDialog from "../../../components/dialog/FormDialog";

// Import all of the forms
import AvatarForm from "./components/AvatarForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import DeleteAccountForm from "./components/DeleteAccountForm";
import EditEmailForm from "./components/EditEmailForm";
import EditFullNameForm from "./components/EditFullNameForm";
import EditUsernameForm from "./components/EditUsernameForm";

import { useState } from "react";

export default function ProfilePage() {
	const { auth } = useAuthContext();
	const logout = useLogout();

	const [activeDialog, setActiveDialog] = useState("");
	const handleOpenDialog = (dialogName) => setActiveDialog(dialogName);
	const handleCloseDialog = () => setActiveDialog("");

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

						<FormDialog
							open={activeDialog === "editAvatar"}
							handleOpen={() => handleOpenDialog("editAvatar")}
							handleClose={handleCloseDialog}
							btnText="Edit Avatar"
							form={<AvatarForm user={auth.user} />}
							modalTitle="Edit Your Avatar"
						/>
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

								<FormDialog
									open={activeDialog === "editUsername"}
									handleOpen={() => handleOpenDialog("editUsername")}
									handleClose={handleCloseDialog}
									btnText="Edit"
									form={
										<EditUsernameForm
											username={auth.user.username}
											onSuccess={handleCloseDialog}
										/>
									}
									modalTitle="Edit Your Username"
								/>
							</Box>
							<Typography>{auth.user.username}</Typography>
						</Box>

						<Box>
							<Box className="tw-flex tw-justify-between tw-items-center">
								<Typography className="tw-font-bold">Email</Typography>
								<FormDialog
									open={activeDialog === "editEmail"}
									handleOpen={() => handleOpenDialog("editEmail")}
									handleClose={handleCloseDialog}
									btnText="Edit"
									form={
										<EditEmailForm
											email={auth.user.email}
											onSuccess={handleCloseDialog}
										/>
									}
									modalTitle="Edit Your Username"
								/>
							</Box>
							<Typography> {auth.user.email} </Typography>
						</Box>

						<Box>
							<Box className="tw-flex tw-justify-between tw-items-center">
								<Typography className="tw-font-bold">Name</Typography>

								<FormDialog
									open={activeDialog === "editFullName"}
									handleOpen={() => handleOpenDialog("editFullName")}
									handleClose={handleCloseDialog}
									btnText="Edit"
									form={
										<EditFullNameForm
											fullName={auth.user.fullName}
											onSuccess={handleCloseDialog}
										/>
									}
									modalTitle="Edit Your Full Name"
								/>
							</Box>
							<Typography> {auth.user.fullName} </Typography>
						</Box>
					</main>
				</Box>
				<Divider className="tw-my-5" />
				{/* Authentication & Security: Changing Password and logging out. Note that we 
          shouldn't need to pass handleCloseDialog to onSuccess to changing password and account deletion forms 
          because successful submissions will redirect the user to the login screen. */}
				<Box>
					<header className="tw-mb-3">
						<Typography variant="h4">Authentication & Security</Typography>
					</header>
					<main>
						<Box>
							<FormDialog
								open={activeDialog === "changePassword"}
								handleOpen={() => handleOpenDialog("changePassword")}
								handleClose={handleCloseDialog}
								btnText="Change Password"
								menuText="Changing your password will log you out of your account."
								form={<ChangePasswordForm />}
								modalTitle="Change Your Password"
							/>
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
						<FormDialog
							open={activeDialog === "deleteAccount"}
							handleOpen={() => handleOpenDialog("deleteAccount")}
							handleClose={handleCloseDialog}
							btnText="Delete Account"
							btnColor="warning"
							menuText="Deleting your account is permanent and cannot be undone"
							form={<DeleteAccountForm />}
							modalTitle="Delete Your Account"
						/>
					</main>
				</Box>
			</Container>
		</div>
	);
}
