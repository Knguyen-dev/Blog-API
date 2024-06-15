import ejs from "ejs";
import fs from "fs";
import path from "path";
import sendEmail from "./sgMail";

const readFileAsync = fs.promises.readFile;

/**
 * Sends a forgot username email to a user, which in turn provides them their username.
 * 
 * @param email - Email that we are emailing to
 * @param username - Username of the user
 * @param name - Name of the user we are emailing to
 */
const sendForgotUsernameEmail = async (email: string, username: string, name: string) => {
  const templatePath = path.resolve(__dirname, "../../templates/forgotUsername.html")
  const data = await readFileAsync(templatePath, "utf8");
  const htmlContent = ejs.render(data, {username: username, name: name});
  await sendEmail(email, "Forgot Username?", htmlContent);
}

export default sendForgotUsernameEmail;