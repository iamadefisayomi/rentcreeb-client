"use client"

import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { LabelSeparator } from "@/components/ui/separator"
import Routes from "@/Routes"
import SignupForm from "@/sections/auth/SignupForm"
import { SocialAuth } from "@/sections/auth/SocialAuth"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"


export default function Signup () {
    const router = useRouter()
    const [role, setrole] = useState<"agent" | "renter">('agent')
    return (
        <div className="w-full min-h-screen px-2 bg-slate-50 relative flex flex-col items-center justify-start">
            <div className="w-full md:grid md:grid-cols-3 flex flex-row-reverse items-center justify-between gap-2 max-w-7xl mx-auto sticky top-0 left-0 py-5 bg-slate-50">
                <span>
                    <Button onClick={() => router.back()} size='icon' variant='outline' className="bg-slate-50">
                        <ArrowLeft className="w-4 text-primary" />
                    </Button>
                </span>
                <span className="md:flex md:justify-center items-center">
                    <Logo />
                </span>
            </div>

            <div className="w-full py-10 max-w-md flex flex-grow items-center justify-center">
                <div className="rounded-md border bg-white flex flex-col gap-6 w-full  p-6 md:px-8">
                    <div className="w-full flex flex-col items-center">
                        <h2 className="capitalize text-primary font-semibold text-xl">create account</h2>
                        <p className="text-center text-muted-foreground text-[10.5px]">One account for all your activities.</p>
                    </div>

                    <Tabs defaultValue={role} onValueChange={(val: string) => setrole(val as "agent" | "renter")}>
                        <TabsList className="w-full grid grid-cols-2 gap-2 mb-6">
                        <TabsTrigger value="agent">Agent</TabsTrigger>
                        <TabsTrigger value="renter">Renter</TabsTrigger>
                        </TabsList>
                        <TabsContent value={role}>
                            <SignupForm role={role}/>
                                <LabelSeparator label='or' className="bg-white my-6 text-[10px] font-medium text-muted-foreground" />
                            <SocialAuth />
                        </TabsContent>
                    </Tabs>

                    <p className="text-center text-muted-foreground text-[10px]">Already have an account? <Link className="text-primary font-semibold" href={Routes.login}>Login</Link></p>
                </div>
            </div>
        </div>
    )
}