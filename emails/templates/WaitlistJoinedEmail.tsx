import {
  Section,
  Text,
  Button,
} from "@react-email/components";
import BaseEmail from "../layouts/BaseEmail";

export default function WaitlistJoinedEmail({
  name,
}: {
  name: string;
}) {
  return (
    <BaseEmail name={name}>
      {/* Title */}
      <Text style={title}>
        🎉 You're on the RentCreeb 2.0 Waitlist!
      </Text>

      <Text style={subtitle}>
        Thanks for joining! Your spot has been reserved and you're now one of
        the first people who will experience RentCreeb 2.0 before public
        launch.
      </Text>

      {/* Card */}
      <Section style={card}>
        <Text style={label}>Name</Text>
        <Text style={value}>{name}</Text>

        <Text style={label}>Status</Text>
        <Section style={statusBox}>
          <Text style={statusText}>Successfully Joined ✅</Text>
        </Section>

        <Text style={label}>What happens next?</Text>

        <Text style={listItem}>
          • You'll receive exclusive product updates.
        </Text>

        <Text style={listItem}>
          • You'll get priority access when RentCreeb 2.0 launches.
        </Text>

        <Text style={listItem}>
          • You'll be invited to early beta testing and exclusive launch
          events.
        </Text>
      </Section>

      {/* CTA */}
      <Section style={ctaContainer}>
        <Button
          href="https://rentcreeb.com"
          style={button}
        >
          Visit RentCreeb
        </Button>
      </Section>

      {/* Info */}
      <Text style={info}>
        Keep an eye on your inbox—we'll notify you as soon as early access
        becomes available. We're excited to have you with us!
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
  lineHeight: "22px",
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
  marginTop: "14px",
};

const value = {
  fontSize: "16px",
  fontWeight: "500",
};

const statusBox = {
  backgroundColor: "#ECFDF3",
  padding: "12px",
  borderRadius: "6px",
  marginTop: "6px",
  textAlign: "center" as const,
};

const statusText = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#16A34A",
};

const listItem = {
  fontSize: "14px",
  color: "#555",
  marginTop: "8px",
  lineHeight: "22px",
};

const ctaContainer = {
  textAlign: "center" as const,
  marginTop: "30px",
};

const button = {
  backgroundColor: "#3B63F0",
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
  lineHeight: "22px",
};