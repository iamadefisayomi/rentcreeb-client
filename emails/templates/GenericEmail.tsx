import { Text, Button } from "@react-email/components";
import BaseEmail from "../layouts/BaseEmail";
import React from "react";

export default function GenericEmail({
  name,
  message,
  link,
  email
}: {
  name: string;
  message: string;
  link?: string;
  email?: string;
}) {
  return (
    <BaseEmail>
      <Text>{ name ? `Dear ${name}` : 'Hi !'},</Text>

      {message && <Text>{`Message: ${message}`}</Text>}
      {email && <Text>{`Email: ${email}`}</Text>}

      {link && (
        <Button
          href={link}
          style={{
            backgroundColor: "#1877F2",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Open Link
        </Button>
      )}
    </BaseEmail>
  );
}