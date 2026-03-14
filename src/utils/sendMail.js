import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailOptions = {
    ...options,
  };

  if (!emailOptions.from && process.env.SMTP_FROM) {
    emailOptions.from = process.env.SMTP_FROM;
  }

  return transporter.sendMail(emailOptions);
};
