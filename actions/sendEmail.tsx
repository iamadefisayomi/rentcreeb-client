"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import GenericEmail from "@/emails/templates/GenericEmail";
import InspectionBookedEmail from "@/emails/templates/InspectionBookedEmail";
import NewMessageEmail from "@/emails/templates/NewMessageEmail";

export async function sendEmail({
  to,
  subject,
  template,
  data,
}: {
  to: string;
  subject: string;
  template: "generic" | "inspection" | "newMessage" | null | undefined;
  data: any;
}) {
  try {
    let templateComponent;

  if (!template || template === "generic") {
    templateComponent = (
      <GenericEmail
        name={data.name}
        message={data.message}
        link={data.link}
        email={data.email}
      />
    );
  }

  if (template === "inspection") {
    templateComponent = (
      <InspectionBookedEmail
        agentName={data.agentName}
        date={data.date}
        propertyId={data.propertyId}
        renterName={data.renterName}
        time={data.time}
      />
    );
  }

  if (template === "newMessage") {
    templateComponent = (
      <NewMessageEmail
        name={data.name}
        message={data.message}
        link={data.link}
        linkDescription="View Message"
      />
    );
  }

  const html = await render(templateComponent);

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL_ADDRESS,
      pass: process.env.ZOHO_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"RentCreeb" <${process.env.ZOHO_EMAIL_ADDRESS}>`,
    to,
    subject,
    html,
  });

  return { success: true };
  }
  catch(err: any) {
    return ({
      success: false,
      message: err.message
    })
  }
}