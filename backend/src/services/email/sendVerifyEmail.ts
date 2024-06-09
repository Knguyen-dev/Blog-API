import sendEmail from "./sgMail";
import ejs from "ejs";
import fs from "fs";
import path from "path";

const readFileAsync = fs.promises.readFile;

export default async function sendVerifyEmail( username: string, email: string, name: string, url: string) {
  const templatePath = path.resolve(__dirname, "../../templates/verifyEmail.html")
  const data = await readFileAsync(templatePath, "utf8");
  const htmlContent = ejs.render(data, {username: username, name: name, verifyLink: url});
  await sendEmail(email, "Verify Email", htmlContent);
}