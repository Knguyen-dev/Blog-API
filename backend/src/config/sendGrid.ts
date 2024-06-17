import sendGrid from "@sendgrid/mail";
sendGrid.setApiKey(process.env.SEND_GRID_API_KEY as string);

/**
 * Function used to send emails with send grid
 * 
 * @param to - Email we are sending the email to
 * @param subject - Subject line of the email
 * @param html - Html content we are sending in the email
 */
const sendEmail = (to: string, subject: string, html: string) => {  
  const msg = {
    to,
    from: process.env.SEND_GRID_VERIFIED_EMAIL as string,
    subject,
    html,
  };

  return sendGrid.send(msg);
};

export default sendEmail;

