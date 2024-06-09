import {
  Avatar,
  Typography,
  Button,
  Container,
  Box,
  Divider,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";

import useAuthContext from "../../../hooks/useAuthContext";
import useSettingsContext from "../../../hooks/useSettingsContext";
import useLogout from "../../../hooks/useLogout";
import useRequestEmailVerification from "./hooks/useRequestEmailVerification";

// Import dialogs for editing various aspects of a user profile
import EditAvatarDialog from "./components/EditAvatarDialog";
import EditUsernameDialog from "./components/EditUsernameDialog";
import EditEmailDialog from "./components/EditEmailDialog";
import EditFullNameDialog from "./components/EditFullNameDialog";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import DeleteAccountDialog from "./components/DeleteAccountDialog";

import { verifyAdmin } from "../../../utils/roleUtils";

export default function ProfilePage() {
  const { auth } = useAuthContext();
  const { preferences, toggleColorMode, toggleAnimations } =
    useSettingsContext();
  const logout = useLogout();
  const { isLoading, requestEmailVerification } = useRequestEmailVerification();

  /*
	- NOTE: auth.user should be defined since this is behind a ProtectedRoute, but if not 
	throw an error to make it clear what happened. This helps TypeScript and also 
	helps developers.
	*/
  if (!auth.user) {
    throw new Error(
      "ProfilePage component tried to render, but 'auth.user' wasn't defined!"
    );
  }

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

            <Box className="tw-flex">
              <Typography className="tw-mr-2">{auth.user.email}</Typography>

              <Typography
                color={auth.user.isVerified ? "success.main" : "grey.500"}>
                {auth.user.isVerified ? "(Verified)" : "(Unverified)"}
              </Typography>
            </Box>

            {!auth.user.isVerified && (
              <Box>
                <Typography color="text.secondary">
                  Please verify your current email for account recovery reasons.
                  Verifying your email will allow you to reset your password if
                  you forget it. If you can't verify your current email, you can
                  choose to update your email to one that you can access and
                  verify that one instead.
                </Typography>

                <Button
                  variant="contained"
                  className="tw-block tw-ml-auto"
                  disabled={isLoading}
                  // auth.user.id guaranteed to be defined since this is behind a protected route
                  onClick={() => requestEmailVerification(auth.user!._id)}>
                  Send Verification Email
                </Button>
              </Box>
            )}
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

      {/* App settings: Themes and animations */}
      <Box component="section">
        <Box component="header" className="tw-mb-3">
          <Typography variant="h4">App settings</Typography>
        </Box>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.darkMode}
                onChange={toggleColorMode}
              />
            }
            label="Dark Mode"
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.animations}
                onChange={toggleAnimations}
              />
            }
            label="Animations"
          />
        </FormGroup>
      </Box>

      <Divider className="tw-my-5" />
      {/* Authentication & Security: Changing Password and logging out. Note that we 
          shouldn't need to pass handleCloseDialog to onSuccess to changing password and account deletion forms 
          because successful submissions will redirect the user to the login screen. */}
      <Box component="section">
        <Box component="header" className="tw-mb-3">
          <Typography variant="h4">Authentication & Security</Typography>
        </Box>
        <Box>
          {/* Password change dialog is disabled when user isn't verified */}
          <ChangePasswordDialog disabled={!auth.user.isVerified} />

          {!auth.user.isVerified && (
            <Typography className="tw-mt-1 tw-mb-2" color="text.secondary">
              Changing your password is currently disabled because your email
              address has not been verified. Verifying your email helps us
              ensure we can securely send you a password reset link if you
              forget your new password. Please verify your email to enable this
              feature.
            </Typography>
          )}

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
        <Box component="header" className="tw-mb-2">
          <Typography variant="h4">Account Removal</Typography>
        </Box>
        <Box>
          {/* Admins can't delete their own accounts, so disable this */}
          <DeleteAccountDialog disabled={verifyAdmin(auth.user.role)} />

          {verifyAdmin(auth.user.role) && (
            <Typography className="tw-mt-2" color="text.secondary">
              Admins cannot remove their own accounts due to how important
              administrator accounts are. If you want to delete your account,
              please ask another admin to delete your account!
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
