// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer'
import * as path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

const createMail = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    return false;
  }
};

const sendMail = async (subject, receiver, html) => {
  const transporter = createTransporter();

  const imagePath = path.join(__dirname, "../utils/welcome.jpg");

  const mailOptions = {
    from: `"MI Blogs" <${process.env.MAIL_USERNAME}>`,
    to: receiver,
    subject: subject,
    html: html,
  };

  try {
    const emailSent = await createMail(transporter, mailOptions);
    return emailSent;
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // or handle the error appropriately
  }
};


export default sendMail
