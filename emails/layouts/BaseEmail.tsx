import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Link,
  Font
} from "@react-email/components";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import React from "react";

export default function BaseEmail({
  children,
  name = "User",
}: {
  children: React.ReactNode;
  name?: string;
}) {
  return (
    <Html>
      <Head>

        {/* Load Poppins */}
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />

      </Head>

      <Body style={body}>
        <Container style={container}>
          
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://ik.imagekit.io/rentcreeb/RentHouse%20Logo.png"
              // width="300"
              // height="32"
              alt="RentCreeb"
              style={{ display: "inline-block", marginRight: 8, objectFit: 'contain' }}
            />
            {/* <Text style={headerText}>RentHouse</Text> */}
          </Section>

          {/* Hero Illustration */}
          <Section style={heroSection}>
            <Img
              src="https://ik.imagekit.io/rentcreeb/email-image.png?updatedAt=1773101268862"
              alt="Hero"
              width="350"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {name}!</Text>

            {children}
          </Section>

          {/* CTA Banner */}
          <Section style={{width: '100%', paddingLeft: '20px', paddingRight: '20px'}}>
          <Section style={ctaBanner}>
            <Text style={ctaText}>
              Looking Ahead: What to Watch Next
            </Text>
          </Section>
          </Section>

          {/* Social Links */}
          <Section style={socialSection}>
            <Linkedin href="https://linkedin.com" style={social}/>

            <Instagram href="https://instagram.com" style={social}/>

            <Twitter href="https://twitter.com" style={social}/>

            <Text style={followText}>Follow us @rentcreeb</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you prefer not to receive these emails, you can{" "}
              <Link href="https://rentcreeb.com/unsubscribe">
                unsubscribe
              </Link>.
            </Text>

            <Text style={footerText}>
              Copyright © {new Date().getFullYear()} RentCreeb
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#e6e6e6",
  fontFamily: "Arial, sans-serif",
  padding: "30px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  overflow: "hidden",
  maxWidth: "600px",
  margin: "0 auto",
};

const header = {
  backgroundColor: "#3b63f0",
  padding: "22px",
  textAlign: "center" as const,
};

const headerText = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "bold",
};

const heroSection = {
  padding: "40px 20px 10px",
  textAlign: "center" as const,
};

const content = {
  padding: "20px 40px",
  color: "#444",
  fontSize: "15px",
  lineHeight: "1.6",
};

const greeting = {
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const ctaBanner = {
  backgroundColor: "#3b63f0",
  padding: "30px",
  textAlign: "center" as const,
  marginTop: "30px",
  borderRadius: '20px'
};

const ctaText = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "bold",
};

const socialSection = {
  padding: "25px",
  textAlign: "center" as const,
};

const social = {
  margin: "0 8px",
  color: "#444",
  fontSize: "14px",
  textDecoration: "none",
};

const followText = {
  marginTop: "10px",
  fontSize: "13px",
  color: "#666",
};

const footer = {
  borderTop: "1px solid #eee",
  padding: "20px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#777",
};