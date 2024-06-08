import mailTransporter from "./mailTransporter";
import ejs from "ejs";
import fs from "fs";
import path from "path";

const readFileAsync = fs.promises.readFile;

const sendForgotUsernameEmail = async (email: string, username: string, name: string) => {
  const templatePath = path.resolve(__dirname, "../../templates/forgotUsername.html")
  const data = await readFileAsync(templatePath, "utf8");
  
  const htmlContent = ejs.render(data, {username: username, name: name});
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Forgot Username",
    html: htmlContent
  }
  await mailTransporter.sendMail(mailOptions);
}

export default sendForgotUsernameEmail;