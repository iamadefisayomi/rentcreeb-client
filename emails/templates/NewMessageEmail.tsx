import { Section, Text, Button } from "@react-email/components";
import BaseEmail from "../layouts/BaseEmail";

export default function NewMessageEmail({
  name,
  message,
  link,
  linkDescription,
}: {
  name: string;
  message: string;
  link: string;
  linkDescription: string;
}) {
  return (
    <BaseEmail name={name}>
      {/* Title */}
      <Text style={title}>You have a new message</Text>

      <Text style={subtitle}>
        Someone sent you a message on RentCreeb.
      </Text>

      {/* Message Card */}
      <Section style={card}>
        <Text style={messageText}>{message}</Text>
      </Section>

      {/* CTA */}
      <Section style={ctaContainer}>
        <Button href={link} style={button}>
          {linkDescription}
        </Button>
      </Section>

      {/* Info */}
      <Text style={info}>
        You are receiving this email because you have notifications enabled
        for messages on RentCreeb.
      </Text>
    </BaseEmail>
  );
}

const title = {
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "8px",
};

const subtitle = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "20px",
};

const card = {
  backgroundColor: "#f9fafb",
  border: "1px solid #eee",
  borderRadius: "8px",
  padding: "20px",
};

const messageText = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#333",
};

const ctaContainer = {
  textAlign: "center" as const,
  marginTop: "30px",
};

const button = {
  backgroundColor: "#3b63f0",
  color: "#ffffff",
  padding: "12px 22px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
};

const info = {
  fontSize: "12px",
  color: "#777",
  marginTop: "20px",
};