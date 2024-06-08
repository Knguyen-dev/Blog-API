import mailTransporter from "./mailTransporter";
import ejs from "ejs";
import fs from "fs";
import path from "path";

const readFileAsync = fs.promises.readFile;

const sendForgotPasswordEmail = async (email: string, name: string, url: string) => {
  const templatePath = path.resolve(__dirname, "../../templates/forgotPassword.html")
  const data = await readFileAsync(templatePath, "utf8");

  const htmlContent = ejs.render(data, {resetLink: url, name: name});
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Password",
    html: htmlContent
  }
  await mailTransporter.sendMail(mailOptions);
}

export default sendForgotPasswordEmail;