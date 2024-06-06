const nodemailer = require("nodemailer");

const gmailTransporter = nodemailer.createTransport({
	service: process.env.SERVICE,
	auth: {
		user: process.env.AUTH_EMAIL,
		pass: process.env.AUTH_PASS,
	},
});


gmailTransporter.verify((error: any) => {
	if (error) {
		console.log(error);
	} else {
		console.log("Email system ready to send messages!");
	}
});

export default gmailTransporter;