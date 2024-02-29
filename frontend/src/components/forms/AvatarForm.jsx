import { Button, Box, Avatar } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState, useRef } from "react";
import useChangeAvatar from "../../hooks/user/useChangeAvatar";
import DeleteAvatarDialog from "../dialog/DeleteAvatarDialog";
import PropTypes from "prop-types";

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

export default function AvatarForm({ user }) {
	const [file, setFile] = useState();
	const [imagePreview, setImagePreview] = useState();
	const { error, isLoading, changeAvatar } = useChangeAvatar();
	const avatarInputRef = useRef(null);

	/*
  + Effect: Updates image preview when user's avatar changes. As a result
    when the user opens up the AvatarForm, the initial image that will be 
    previewed will be their current profile picture.
  */
	useEffect(() => {
		setImagePreview(user.avatarSrc || null);
	}, [user.avatarSrc]);

	const handleFileChange = (e) => {
		/*
    - e.target.files: An array of containing selected files. We 
      select the first file since we're typically handling single-file uploads
    */
		const selectedFile = e.target.files[0];
		setFile(selectedFile);
		/*
    - Preview the image using FileReader API:
    1. Create a file reader instance, allowing the reading of content of files stored
      on the user's computer. Then our .onloadend fires when reading operation
      is completed (whether success or failed). We do reader.result, which contains
      the data URL representing the file's content. Set this as the imagePreview state.

    2. .readAsDataURL: Initiates the reading of the selected file as a data URL. 
      Once this is done, the onloadend event will be triggered! 
    */
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(selectedFile);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		await changeAvatar(file);
		avatarInputRef.current.value = null; // reset input type file's appearance after a good submission
	};

	return (
		<form onSubmit={onSubmit}>
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
				<input
					type="file"
					id="profile-picture"
					name="profile-picture"
					accept="image/png, image/jpeg, image/jpg"
					ref={avatarInputRef}
					onChange={handleFileChange}
					required
				/>

				<Box
					sx={{
						display: "flex",
						marginTop: 2,
						justifyContent: "space-between",
					}}>
					<DeleteAvatarDialog
						isLoading={isLoading}
						changeAvatar={changeAvatar}
					/>
					<Button
						variant="contained"
						type={"submit"}
						disabled={isLoading}
						startIcon={<CloudUploadIcon />}>
						Submit
					</Button>
				</Box>
			</Box>

			{error && (
				<Box className="error" sx={{ marginTop: 2 }}>
					{error}
				</Box>
			)}
		</form>
	);
}
AvatarForm.propTypes = {
	user: PropTypes.shape({
		avatarSrc: PropTypes.string,
		avatarInitials: PropTypes.string,
	}),
};
