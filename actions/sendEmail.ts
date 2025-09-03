"use server"

import nodemailer from "nodemailer";

export async function sendEmail({to, name, message, link, subject, linkDescription}: {to: string, name: string, message: string, link?: string, subject?: string, linkDescription?: string}) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      // service: "gmail",
      auth: {
        user: process.env.ZOHO_EMAIL_ADDRESS,
        pass: process.env.ZOHO_EMAIL_PASSWORD, // Use App Password instead of regular password
      },
    });

    const htmlTemplate = `
     <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation Email - RentCreeb INC</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
      margin: 0;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #1877F2;
      color: white;
      text-align: center;
      padding: 20px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px 8px 0 0;
      width: 100%;
    }
    .content {
      padding: 20px;
      font-size: 14px;
      color: #333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #1877F2;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
      text-align: center;
    }
    .footer {
      background: #f4f4f4;
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: #777;
      border-radius: 0 0 8px 8px;
      width: 100%;
    }
    .footer a {
      color: #1877F2;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">RentCreeb INC</div>
    <div class="content">
      <p>Dear ${name},</p>
      <p>${message}</p>
      <a href="${link}">${linkDescription}</a>
      <p>If you need urgent assistance, please do not hesitate to contact our support team.</p>
      <p><a href="mailto:support@rentcreeb.com" class="button">Contact Support</a></p>
    </div>
    <div class="footer">
      &copy; 2024 RentCreeb INC |  
      <a href="https://rentcreeb.com/unsubscribe?email=${to}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>

`

    const mailOptions = {
      from: `"RentCreeb INC" <admin@rentcreeb.com>`,
      to,
      subject: `${subject}`,
      text: `Dear ${name},\n\n${message}\n\n${link ? `Take Action: ${link}` : ''}\n\nRegards,\nRentCreeb INC.`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: info.messageId };
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return { success: false, message: error.message };
  }
}
