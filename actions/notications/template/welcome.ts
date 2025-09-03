"use client"


export default function welcomeEmail ({name, messageTitle, message}: {name: string, message: string, messageTitle?: string}) { 
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirmation Email - RentCreeb INC</title>
  <style>
    /* Reset some default styles */
    body, p, h1, h2, h3, h4, h5, h6 {
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9fafb;
      padding: 30px 15px;
      color: #333;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .email-container {
        max-width: 600px;
        background: #ffffff;
        margin: 0 auto;
        border-radius: 12px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        overflow: hidden;
        border: 1px solid #e2e8f0;
        }
    .header {
      background: linear-gradient(90deg, #4f46e5, #3b82f6);
      color: #fff;
      text-align: center;
      padding: 30px 20px;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
      .seperator {
        margin-top: 10px;
        margin-bottom: 10px;
      }
    .content {
      padding: 30px 30px 40px;
      font-size: 16px;
      line-height: 1.55;
      color: #4b5563;
    }
      .greeting_message {
       text-transform: capitalize;
      }
    .content p {
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #3b82f6;
      color: #fff;
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
    .button:hover,
    .button:focus {
      background-color: #2563eb;
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
    }
    .footer {
      background: #f3f4f6;
      color: #6b7280;
      font-size: 14px;
      text-align: center;
      padding: 20px 15px;
      border-top: 1px solid #e5e7eb;
      border-radius: none;
    }
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    .footer a:hover,
    .footer a:focus {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .email-container {
        width: 100% !important;
        border-radius: 0;
      }
      .header {
        font-size: 16px;
        padding: 20px 15px;
      }
      .content {
        padding: 20px 15px 30px;
        font-size: 15px;
      }
      .button {
        padding: 12px 22px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container" role="article" aria-label="Confirmation Email">
    <div class="header">
      RentCreeb INC  ${messageTitle ? '- ' + messageTitle : ''}
    </div>
    <div class="content">
      <p class="greeting_message">Dear ${name || 'buddy'},</p>
      <p>${message}</p>

      <hr class="seperator"/>
      <p>If you need urgent assistance, please do not hesitate to contact our support team.</p>
      <p><a href="mailto:support@rentcreeb.com" class="button" aria-label="Contact Support via Email">Contact Support</a></p>
    </div>
    <div class="footer" role="contentinfo">
      &copy; 2024 Rent House INC |  
      <a href="https://rentcreeb.com/unsubscribe?email=${process.env.MAIN_EMAIL}" aria-label="Unsubscribe from Rent House INC emails">Unsubscribe</a>
    </div>
  </div>
</body>
</html>
`
}
