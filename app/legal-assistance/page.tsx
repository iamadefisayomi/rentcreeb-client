"use client"

import { Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function LegalAssistancePage() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">

        {/* <section>
          <h2 className="text-2xl font-semibold mb-6">What We Offer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Tenancy Dispute Support",
                desc: "Guidance on rent disagreements, eviction notices, and lease issues.",
              },
              {
                title: "Property Ownership Verification",
                desc: "Legal verification and title checks before property listing or rental.",
              },
              {
                title: "Agreement Drafting",
                desc: "Professional review and preparation of tenancy and lease agreements.",
              },
              {
                title: "Compliance Advisory",
                desc: "Ensuring listings and agreements meet housing regulations.",
              },
            ].map((item) => (
              <Card key={item.title} className="shadow-md">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section> */}

        <div className="w-full flex items-center justify-center py-20">
        <section className="w-full max-w-7xl flex flex-col gap-4">
          <h2 className="text-2xl font-bold">
            Report or Request Legal Support
          </h2>
          <p className="text-gray-600 text-[13px] max-w-2xl">
            If you need legal assistance or wish to report a dispute, fill out the form below.
            A Rentcreeb legal partner will respond within 2–3 business days.
          </p>
          <form className="grid gap-4 max-w-lg">
            <Input
              type="text"
              placeholder="Full Name"
            />
            <Input
              type="email"
              placeholder="Email Address"
            />
            <Textarea
              rows={4}
              placeholder="Describe your issue or request..."
            />
            <Button type="submit" className="w-fit">
              Submit Request
            </Button>
          </form>
        </section>
        </div>

        <section className="bg-primary w-full min-h-[50vh] flex items-center justify-center p-20">
          <Card className="bg-gray-100 border-none w-full max-w-5xl">
            <CardContent className="pt-6 text-gray-700 leading-relaxed text-[13px]">
              <p>
                <strong>Disclaimer:</strong> Rentcreeb Inc. is not a law firm and does not
                provide legal representation. Our role is to connect users to verified legal
                professionals and ensure platform compliance with housing standards.
              </p>
              <p className="mt-3 text-center">
                For urgent or serious legal matters, please contact your local legal
                authority or housing tribunal directly.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center space-y-3 min-h-[50vh] flex items-center justify-center flex-col">
          <h2 className="text-2xl font-semibold">Contact Legal Support</h2>
          <p className="text-gray-600 text-[13px]">{"We’re here to assist with your rental-related concerns."}</p>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2 text-[13px]">
              <Phone className="text-blue-600" />
              <span>+1 (800) 555-RENT</span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <Mail className="text-blue-600" />
              <span>legal@rentcreeb.com</span>
            </div>
          </div>
        </section>
    </div>
  );
}
