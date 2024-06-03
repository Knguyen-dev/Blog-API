import { Button, TextField, Box } from "@mui/material";
export default function ContactForm() {
	return (
		<form className="tw-flex tw-flex-col tw-gap-y-4">
			<Box className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-2">
				<TextField
					id="name"
					name="name"
					label="Name"
					placeholder="Enter your name"
					required
					className="tw-flex-1"
				/>
				<TextField
					id="subject"
					name="subject"
					label="Subject"
					placeholder="Subject of the message"
					className="tw-flex-1"
				/>
			</Box>
			<Box className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-2">
				<TextField
					id="email"
					name="email"
					label="Email"
					placeholder="Enter your email"
					type="email"
					required
					className="tw-flex-1"
				/>
				<TextField
					id="phone"
					name="phone"
					label="Phone Number"
					placeholder="Enter your phone number"
					className="tw-flex-1"
				/>
			</Box>

			<TextField
				id="message"
				name="message"
				label="Message"
				placeholder="Enter your message"
				required
				multiline
				minRows={4}
				maxRows={4}
			/>
			<Button
				variant="contained"
				color="primary"
				type="submit"
				className="tw-self-end">
				Submit
			</Button>
		</form>
	);
}
