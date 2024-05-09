import { Box, TextField, Button } from "@mui/material";

const borderRadius = 4;
// May get rid of this
export default function EmailSubscriptionForm() {
	return (
		<Box component="form" sx={{ display: "flex" }}>
			<TextField
				size="small"
				id="emailSubscription"
				name="email"
				type="email"
				aria-label="Email"
				placeholder="Enter your email"
				InputProps={{
					sx: {
						borderRadius: 0,
						borderTopLeftRadius: borderRadius,
						borderBottomLeftRadius: borderRadius,
					},
				}}
				required
			/>

			<Button
				variant="contained"
				type="submit"
				size="small"
				sx={{
					borderRadius: 0,
					borderTopRightRadius: borderRadius,
					borderBottomRightRadius: borderRadius,
					paddingX: 2,
				}}
				aria-label="Subscribe to email list">
				Subscribe
			</Button>
		</Box>
	);
}
