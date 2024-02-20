import { EmailAdapter } from "../adapters/email-adapter";

export class EmailService {
  static confirmEmailSend(userEmail: string, confirmCode: string) {
    return EmailAdapter.sendEmail({
      to: userEmail,
      subject: "Confirm your mail",
      html: `<h1>Thank you for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href="https://blog-project-wheat-sigma.vercel.app/auth/registration-confirmation?code=${confirmCode}">complete registration</a>
 </p>`,
    });
  }
}
