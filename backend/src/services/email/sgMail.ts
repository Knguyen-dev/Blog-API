import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string);

const sendEmail = (to: string, subject: string, html: string) => {  
  const msg = {
    to,
    from: process.env.EMAIL_FROM as string,
    subject,
    html,
  };

  return sgMail.send(msg);
};



export default sendEmail;

