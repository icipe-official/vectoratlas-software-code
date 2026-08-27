import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { v4 as uuidv4 } from 'uuid';

export interface EmailSendResponse {
  success: boolean;
  info: SMTPTransport.SentMessageInfo;
  error: string;
}

export const sendEmail = async (
  recipients: string,
  subject: string,
  message: string,
): Promise<EmailSendResponse> => {
  // 1. Generic SMTP configuration reading directly from your environmental primitives
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: recipients,
    subject: subject,
    text: message,
    html: message,
  };

  const res: EmailSendResponse = {
    success: false,
    info: null,
    error: null,
  };

  if (process.env.NODE_ENV == 'test') {
    console.warn('We are in test mode. So we are just mock sending emails');
    const mockInfo: SMTPTransport.SentMessageInfo = {
      accepted: [recipients],
      rejected: [],
      pending: [],
      envelope: null,
      response: 'Email sent successfully',
      messageId: uuidv4() + '@gmail.com',
    };
    res.success = true;
    res.info = mockInfo;
    res.error = null;
    return res;
  }

  try {
    const info: SMTPTransport.SentMessageInfo = await transporter.sendMail(
      mailOptions,
    );
    res.success = true;
    res.info = info;
    res.error = null;
  } catch (error: any) {
    res.success = false;
    res.info = null;
    // Extracted message string prevents runtime serialization bugs in the response container
    res.error = error?.message || String(error);
  }
  return res;
};
