import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPPool from "nodemailer/lib/smtp-pool";
import { EmailMessage } from "./types";
import {
    smtpHost as host,
    smtpFromEmail as from,
    smtpPassword as pass,
    smtpUsername as user,
    smtpPort as port
} from "../../env";


let transport: nodemailer.Transporter = null;
export async function sendEmail(msg: EmailMessage) {
    if (!transport) {
        const options: SMTPPool.Options = {
            pool: true,
            host,
            port,
            secure: false,
            auth: { user, pass },
        }
        transport = nodemailer.createTransport(options);
    }
    const messageOptions: Mail.Options = {
        from,
        to: msg.toEmail,
        subject: msg.subject,
        text: msg.body,
    };
    return transport.sendMail(messageOptions);
};
