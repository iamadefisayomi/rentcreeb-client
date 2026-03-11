import { Text, Button } from "@react-email/components";
import BaseEmail from "../layouts/BaseEmail";
import React from "react";

export default function GenericEmail({
  name,
  message,
  link,
}: {
  name: string;
  message: string;
  link?: string;
}) {
  return (
    <BaseEmail>
      <Text>{ name ? `Dear ${name}` : 'Hi !'},</Text>

      <Text>{message}</Text>

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