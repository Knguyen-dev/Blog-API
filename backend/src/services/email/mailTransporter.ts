import nodemailer from "nodemailer";



const mailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST as string,
  port: parseInt(process.env.EMAIL_PORT as string),
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string
  }
});


mailTransporter.verify((err: any) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Email system ready to send messages!");
  }
})

export default mailTransporter;