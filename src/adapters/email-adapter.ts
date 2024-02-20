import nodemailer from "nodemailer";
import { appConfig } from "../config/config";

export type SendEmailModel = {
  to: string;
  subject: string;
  html: string;
};

const transport = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: appConfig.EMAIL_LOGIN,
    pass: appConfig.EMAIL_PASSWORD,
  },
});

export class EmailAdapter {
  static async sendEmail({ to, subject, html }: SendEmailModel) {
    return await transport.sendMail({
      from: "My Test Account <aghartur@bk.ru>",
      to: to,
      subject: subject,
      html: html,
    });
  }
}
