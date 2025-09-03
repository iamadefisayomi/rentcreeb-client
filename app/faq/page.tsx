"use client"

import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import FaqForm from "@/sections/contact-us/FaqForm";
  

export default function Faq () {
    return (
        <LayoutWithImageHeader
            title="frequently asked questions"
            bgImage="https://plus.unsplash.com/premium_photo-1680302397750-ef86e280a172?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        >
            <div className="w-full mx-auto max-w-8xl flex-col-reverse px-4 items-center md:flex-row flex md:items-start gap-10 py-20">
                <div className="w-full flex flex-col items-start gap-2">
                    <h3 className="text-primary text-xs italic uppercase">signature features</h3>
                    <h1 className="text-2xl font-semibold text-slate-900  max-w-md">Masterful Design: A Showcase of Quality and Craftsmanship</h1>

                    <Accordion type="single" collapsible className="w-full">
                        {
                            _faqs.map((faq, index) => (
                            <AccordionItem key={index} value={faq.question} >
                                <AccordionTrigger className="text-sm text-slate-900 lowercase font-semibold">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-xs ml-10 text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                            ))
                        }
                    </Accordion>
                </div>
                
                <FaqForm />
            </div>
        </LayoutWithImageHeader>
    )
}


const _faqs = [
    {
      question: "How do I list my property on RentCreeb?",
      answer:
        "To list your property, sign in to your account, go to the 'Add New Property' section, and fill in the required details such as title, description, price, and images. Once submitted, our team will review and approve your listing."
    },
    {
      question: "Is there a fee to list my property?",
      answer:
        "Listing a property on RentCreeb is free. However, we offer premium listing options for increased visibility at an additional cost."
    },
    {
      question: "How can I contact a landlord or property owner?",
      answer:
        "Once you find a property you’re interested in, you can contact the owner directly through the messaging feature on the property listing page."
    },
    {
      question: "What payment methods are accepted for rent payments?",
      answer:
        "RentCreeb supports payments via credit/debit cards, bank transfers, and digital wallets. The available payment options depend on the landlord's preferences."
    },
    {
      question: "Are the listings verified?",
      answer:
        "We strive to ensure all listings are genuine. Our team manually reviews and verifies properties, but we advise users to visit the property in person before making any payments."
    },
    {
      question: "How can I report a fraudulent listing?",
      answer:
        "If you come across a suspicious listing, click the 'Report' button on the listing page or contact our support team at support@RentCreeb.com."
    },
    {
      question: "Can I edit or delete my property listing after publishing?",
      answer:
        "Yes, you can edit or remove your property listing at any time from your dashboard under the 'My Listings' section."
    },
    {
      question: "What should I do if I forget my account password?",
      answer:
        "Click on 'Forgot Password' on the login page, enter your registered email, and follow the instructions sent to reset your password."
    }
  ];
  