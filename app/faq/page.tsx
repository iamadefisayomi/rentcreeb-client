"use client"

import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { _faqQuestions } from "@/sections/faq/_faqQuestions";
import FaqForm from "@/sections/faq/FaqForm";
  

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
                            _faqQuestions.map((faq, index) => (
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


