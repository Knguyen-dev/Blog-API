import sendEmail from "./sgMail";
import ejs from "ejs";
import fs from "fs";
import path from "path";

const readFileAsync = fs.promises.readFile;

/**
 * Sends a forgot password email to a user's email
 *    
 * @param email - Email that we are emailing to
 * @param name - Name of the user we are emailing to
 * @param url - Forgot password link the user can click. It would redirect the user to the front-end, which is where 
 *              they will be allowed to reset their password by entering a new password.
 */
const sendForgotPasswordEmail = async (email: string, name: string, url: string) => {
  const templatePath = path.resolve(__dirname, "../../templates/forgotPassword.html")
  const data = await readFileAsync(templatePath, "utf8");
  const htmlContent = ejs.render(data, {resetLink: url, name: name});
  await sendEmail(email, "Forgot password?", htmlContent);
}

export default sendForgotPasswordEmail;