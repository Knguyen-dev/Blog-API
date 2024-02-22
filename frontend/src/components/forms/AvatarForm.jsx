import { Button, Typography, Box, Avatar } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useState } from "react";
import useChangeAvatar from "../../hooks/useChangeAvatar";

/*
+ Handling an image form
- NOTE: 
  1. May need a yup validation? Probably not, but we definitely still need
  server side validation as that always stays true with form validation.

  2. For only accepting images, you can do "image/*" to accept all forms. However
    this is a wildcard and comes with some drawbacks. Wildcard support is 
    doesn't work on certain browsers and it's success rate on mobile is sketchy.
    This allows all image files such as png, jpg, jpeg, gif, bmp, ico, tiff, svg, etc.
    In the end it's just better to specify what you want.
*/

export default function AvatarForm() {
	const [file, setFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const { error, isLoading, changeAvatar } = useChangeAvatar();

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
	};

	return (
		<form onSubmit={onSubmit}>
			<Typography variant="h5" component="h2" sx={{ textAlign: "center" }}>
				Upload your pfp!
			</Typography>

			<Box sx={{ display: "flex", justifyContent: "center", marginY: 2 }}>
				<Avatar sx={{ height: 125, width: 125 }} src={imagePreview} />
			</Box>

			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", sm: "row" },
					gap: 3,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<input
					type="file"
					id="profile-picture"
					name="profile-picture"
					accept="image/png, image/jpeg, image/jpg"
					onChange={handleFileChange}
					required
				/>
				<Button
					variant="contained"
					type={"submit"}
					disabled={isLoading}
					startIcon={<CloudUploadIcon />}>
					Submit
				</Button>
			</Box>

			{error && (
				<Box className="error" sx={{ marginTop: 2 }}>
					{error}
				</Box>
			)}
		</form>
	);
}
