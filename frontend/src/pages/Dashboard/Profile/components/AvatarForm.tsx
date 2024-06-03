import { Button, Box, Avatar, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";
import useChangeAvatar from "../hooks/useChangeAvatar";
import AlertDialog from "../../../../components/dialog/AlertDialog";
import { IUser } from "../../../../types/Post";

/*
+ Handling an image form:
1. Validation: Yup doesn't do file validation so the file validation will be 
  on the server-side with multer.

2. For only accepting images, you can do "image/*" to accept all forms. However
  this is a wildcard and comes with some drawbacks. Wildcard support is 
  doesn't work on certain browsers and it's success rate on mobile is sketchy.
  This allows all image files such as png, jpg, jpeg, gif, bmp, ico, tiff, svg, etc.
  In the end it's just better to specify what you want, but even then you can't 
  stop the user from sending the files they want. So in the end server-side validation
  is your only line of defense.
*/

interface IAvatarFormProps {
  user: IUser;
}

export default function AvatarForm({ user }: IAvatarFormProps) {
  // States for the main avatar form
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const { error, isLoading, changeAvatar } = useChangeAvatar();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // States for avatar dialog
  const [open, setOpen] = useState(false);

  /*
  + Effect: Updates image preview when user's avatar changes. As a result
    when the user opens up the AvatarForm, the initial image that will be 
    previewed will be their current profile picture.
  */
  useEffect(() => {
    setImagePreview(user.avatarSrc);
  }, [user.avatarSrc]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    /*
    - e.target.files: An array of containing selected files. We 
      select the first file since we're typically handling single-file uploads
    */
    const selectedFile = e.target.files?.[0];

    /*
		- Update file state and preview state when there's a file
		- Preview the image using FileReader API:
		1. Create a file reader instance, allowing the reading of content of files stored
		on the user's computer. Then our .onloadend fires when reading operation
		is completed (whether success or failed). We do reader.result, which contains
		the data URL representing the file's content. Set this as the imagePreview state.

		2. .readAsDataURL: Initiates the reading of the selected file as a data URL. 
		Once this is done, the onloadend event will be triggered! This method returns 
		types 'string | ArrayBuffer | null' whilst Avatar accepts 'string | undefined', so 
		only return the reader.result when it's a string, and for other cases return undefined.
		*/
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(
          typeof reader.result === "string" ? reader.result : undefined
        );
      };
      reader.readAsDataURL(selectedFile);
    } else {
      /*
			- No file was selected (canceled the file selector). So
			clear the file state, which would match our input component, and 
			also reset the imagePreview back to undefined. 

			- NOTE: If the user has an avatarSrc, setting the imagePreview back to undefined
			will show the initials on the avatar. By setting it to undefined and showing the user's 
			initials on the avatar, rather than the avatarSrc, it makes it more clear that the user 
			doesn't have a image file selected for the avatar.
			*/
      setFile(null);
      setImagePreview(undefined);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    /*
		- Update/add avatar by calling changeAvatar with the new image file.
		Then for the ref, clear it's value, which would reset the 
		input type file's appearance after a good submission.
		*/
    if (file) {
      await changeAvatar(file);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  /*
	
	
	*/
  const handleDeleteAvatar = async () => {
    await changeAvatar();
    setOpen(false);
  };

  const avatarDialogActions = (
    <Box>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button
        onClick={handleDeleteAvatar}
        color="warning"
        type="submit"
        disabled={isLoading}>
        Delete
      </Button>
    </Box>
  );

  return (
    <form onSubmit={onSubmit}>
      {/* Avatar image preview */}
      <Box sx={{ display: "flex", justifyContent: "center", marginY: 2 }}>
        <Avatar
          sx={{ height: 125, width: 125, fontSize: "3.5rem" }}
          src={imagePreview}>
          {user.avatarInitials}
        </Avatar>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}>
        {/* Input element for selecting an image file for the user's avatar */}
        <input
          type="file"
          id="profile-picture"
          name="profile-picture"
          accept="image/png, image/jpeg, image/jpg"
          ref={avatarInputRef}
          onChange={handleFileChange}
          required
        />

        {/* Buttons for prompting deleting an avatar, or submitting the current image file 
					to update the user's current avatar */}
        <Box
          sx={{
            display: "flex",
            marginTop: 2,
            justifyContent: "space-between",
          }}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setOpen(true)}>
            Delete Avatar?
          </Button>
          <Button
            variant="contained"
            type={"submit"}
            disabled={isLoading}
            startIcon={<CloudUploadIcon />}>
            Submit
          </Button>
        </Box>
      </Box>

      {/* Avatar for confirming the deletion of the user's current avatar */}
      <AlertDialog
        open={open}
        title="Delete Your Avatar?"
        dialogText={
          <Typography>
            By agreeing, you confirm the permanent deletion of your avatar from
            your account. Please note that once deleted, your avatar cannot be
            recovered.
          </Typography>
        }
        handleClose={() => setOpen(false)}
        dialogActions={avatarDialogActions}
      />

      {error && (
        <Box className="error" sx={{ marginTop: 2 }}>
          {error}
        </Box>
      )}
    </form>
  );
}
