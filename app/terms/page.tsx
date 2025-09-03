"use client"

import RootLayout from "@/sections/layout";
import {
    AlertDialog,
    AlertDialogContent,
  } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";


export default function TermsAndConditions() {
    const router = useRouter()
    const [open, setOpen] = useState(true)

    const handleClose = () => {
        setOpen(false)
        router.back()
    }
    return (
        <RootLayout disableHeader>
             <AlertDialog open={open}  onOpenChange={handleClose}>
            <AlertDialogContent className="w-full h-screen overflow-y-auto md:min-w-[1000px] z-[1000] bg-slate-100">
            
      <div className="max-w-5xl mx-auto p-6 bg-slate-100">
        <div className="w-full flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Terms and Conditions</h1>
            <Button onClick={handleClose} size='icon' variant='outline'><X /></Button>
        </div>
        <p className="text-gray-600 mb-6 text-xs">Last updated: March 2025</p>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">1. Introduction</h2>
          <p className="text-gray-600 text-xs">
            Welcome to Rent House INC. These Terms and Conditions govern your use of our platform, 
            including website and services. By accessing or using our services, you agree to comply with these terms.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">2. Eligibility</h2>
          <p className="text-gray-600 text-xs">
            You must be at least 18 years old to use our services. By using Rent House INC, you warrant that you have 
            the legal capacity to enter into a binding agreement.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">3. Account Registration</h2>
          <p className="text-gray-600 text-xs">
            To access certain features, you may be required to create an account. You are responsible for maintaining 
            the confidentiality of your account credentials.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">4. Payments & Fees</h2>
          <p className="text-gray-600 text-xs">
            All rental transactions are subject to applicable fees. Payments must be made through our approved methods. 
            Late payments may result in penalties or account suspension.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">5. Property Listings</h2>
          <p className="text-gray-600 text-xs">
            Rent House INC is not responsible for the accuracy of property listings. Landlords must ensure that their 
            listings are up-to-date and truthful.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">6. Cancellations & Refunds</h2>
          <p className="text-gray-600 text-xs">
            Cancellation policies vary by property. Refunds are subject to the cancellation terms set by the landlord.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">7. Prohibited Activities</h2>
          <ul className="list-disc list-inside text-gray-600 text-xs">
            <li>Using the platform for illegal activities</li>
            <li>Posting fraudulent property listings</li>
            <li>Harassing or defrauding other users</li>
            <li>Violating any local or international laws</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">8. Liability & Disclaimers</h2>
          <p className="text-gray-600 text-xs">
            Rent House INC provides a platform for connecting renters and landlords but is not liable for any disputes, 
            damages, or losses arising from property rentals.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">9. Changes to Terms</h2>
          <p className="text-gray-600 text-xs">
            We may update these Terms and Conditions from time to time. Continued use of our platform signifies acceptance of any changes.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className=" font-bold text-primary mb-2 text-xs uppercase ">10. Contact Us</h2>
          <p className="text-gray-600 text-xs">
            If you have any questions about these Terms, please contact us at support@rentcreebinc.com.
          </p>
        </section>
      </div>
      </AlertDialogContent>
        </AlertDialog>
      </RootLayout>
    );
  }
  