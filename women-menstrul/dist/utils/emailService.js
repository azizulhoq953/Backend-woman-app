// src/utils/emailService.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };
    await transporter.sendMail(message);
};
export default sendEmail;
