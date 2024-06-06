import gmailTransporter from "./gmailTransporter";
import { SentMessageInfo } from "nodemailer";
import ejs from "ejs";
import fs from "fs";


const sendVerifyEmail = async (email: string, name: string, verificationURL: string) => {
    fs.readFile("./src/templates/VerifyEmail.ejs", 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading template file:', err);
            return;
        }

        // Render the EJS template with the verification code
        let htmlContent = ejs.render(data, { name: name, verificationURL: verificationURL });

        // Set email configurations
        let mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Email Verification',
            html: htmlContent
        };

        // Send the email
        gmailTransporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
            if (error) {
                console.log('Error occurred:', error.message);
                return;
            }
        });
    });
}

export default sendVerifyEmail;