"use server"


import { errorMessage } from '@/constants';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import welcomeEmail from './template/welcome';

interface EmailOptions {
  to: string; // single or comma-separated emails
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
    cid?: string; // for inline images
  }>;
}

let transporter: Transporter | null = null;

function createTransporter(): Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465
    auth: {
      user: process.env.GMAIL_EMAIL || '',
      pass: process.env.GMAIL_PASS || '',
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    
  });

  return transporter;
}

/**
 * Sends an email.
 *
 * @param options Email options including recipients, subject, body, and optional attachments
 * @returns Promise resolving with info about the sent email
 */
export async function sendEmail(options: EmailOptions): Promise<SentMessageInfo> {
  const { to, subject, text, html, attachments } = options;

  if (!to || !subject || (!text && !html)) {
    throw new Error('Invalid email options: "to", "subject" and at least one of "text" or "html" are required.');
  }

  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'No Reply'}" <${process.env.EMAIL_FROM_ADDRESS || 'no-reply@example.com'}>`,
      to,
      subject,
      text,
      html: welcomeEmail({name: 'dolapo oluwole', message: text!, messageTitle: 'welcome on-board'}),
      attachments,
    });

    console.log(`Email sent: ${info.messageId}`);

    return ({
        success: true,
        message: `Email sent: ${info.messageId}`,
        data: info
    });

  } catch (error: any) {
    return errorMessage(error.message)
  }
}
