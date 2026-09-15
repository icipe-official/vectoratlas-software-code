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
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
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

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
  const res: EmailSendResponse = {
    success: false,
    info: null,
    error: null,
  };

  if (process.env.NODE_ENV == 'test') {
    console.warn('We are in test mode. So we are just mock sending emails');
    // we are running tests, so we do not want to send an actual email
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
  } catch (error) {
    res.success = false;
    res.info = null;
    res.error = error;
  }
  return res;
};
