import ejs from "ejs";
import fs from "fs";
import path from "path";
import sendEmail from "./sgMail";

const readFileAsync = fs.promises.readFile;

const sendForgotUsernameEmail = async (email: string, username: string, name: string) => {
  const templatePath = path.resolve(__dirname, "../../templates/forgotUsername.html")
  const data = await readFileAsync(templatePath, "utf8");
  const htmlContent = ejs.render(data, {username: username, name: name});
  await sendEmail(email, "Forgot Username?", htmlContent);
}

export default sendForgotUsernameEmail;