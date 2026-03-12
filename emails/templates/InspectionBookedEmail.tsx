import {
  Section,
  Text,
  Button,
} from "@react-email/components";
import BaseEmail from "../layouts/BaseEmail";

export default function InspectionBookedEmail({
  renterName,
  propertyId,
  date,
  agentName,
  time
}: {
  renterName: string;
  propertyId: string;
  date: string;
  time: string;
  agentName: string;
}) {
  return (
    <BaseEmail name={agentName}>

      {/* Title */}
      <Text style={title}>
        New Inspection Request
      </Text>

      <Text style={subtitle}>
        {renterName} has scheduled a property inspection.
      </Text>

      {/* Card */}
      <Section style={card}>

        <Text style={label}>Renter</Text>
        <Text style={value}>{renterName}</Text>

        <Text style={label}>Property Title</Text>
        <Text style={value}>{propertyId}</Text>

        <Text style={label}>Inspection Date</Text>

        <Section style={dateBox}>
          <Text style={dateText}>{date}</Text>
        </Section>

        <Text style={label}>Inspection Time</Text>

        <Section style={dateBox}>
          <Text style={dateText}>{time}</Text>
        </Section>

      </Section>

      {/* CTA */}
      <Section style={ctaContainer}>
        <Button
          href="https://rentcreeb.com/dashboard/inspections"
          style={button}
        >
          View Inspection Request
        </Button>
      </Section>

      {/* Info */}
      <Text style={info}>
        Log into your dashboard to approve or reject this inspection request.
      </Text>

    </BaseEmail>
  );
}

const title = {
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "6px",
};

const subtitle = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "25px",
};

const card = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #eee",
};

const label = {
  fontSize: "12px",
  color: "#888",
  marginTop: "10px",
};

const value = {
  fontSize: "16px",
  fontWeight: "500",
};

const dateBox = {
  backgroundColor: "#eef2ff",
  padding: "12px",
  borderRadius: "6px",
  marginTop: "6px",
  textAlign: "center" as const,
};

const dateText = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#3b63f0",
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
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
};

const info = {
  fontSize: "13px",
  color: "#666",
  marginTop: "20px",
};