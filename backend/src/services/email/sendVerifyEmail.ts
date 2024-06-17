import path from "path";
import sendEmail from "../../config/sendGrid";
import ejs from "ejs";
import fs from "fs";

const readFileAsync = fs.promises.readFile;

/**
 * Sends an email verification link to a user's email
 * 
 * @param username - Username of the user who is verifying their email
 * @param email - Email of the user that's verifying their email; this is the email we are sending the email 
 *                verification link to.
 * @param name - Name of the user 
 * @param url - Email verification url that redirects the user to the frontend, where the page they're redirected 
 *              to will trigger the email verification request.
 */
export default async function sendVerifyEmail( username: string, email: string, name: string, url: string) {
  const templatePath = path.resolve(process.cwd(), "public/templates/verifyEmail.html");
  const data = await readFileAsync(templatePath, "utf8");
  const htmlContent = ejs.render(data, {username: username, name: name, verifyLink: url});
  await sendEmail(email, "Verify Email", htmlContent);
}