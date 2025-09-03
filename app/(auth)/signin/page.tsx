"use client"

import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { LabelSeparator } from "@/components/ui/separator"
import Routes from "@/Routes"
import SigninForm from "@/sections/auth/SigninForm"
import { SocialAuth } from "@/sections/auth/SocialAuth"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"


export default function Signin () {
    const router = useRouter()
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
                    <div className="w-full flex flex-col items-center gap-1">
                        <h2 className="capitalize text-primary font-bold text-xl">Sign-In</h2>
                        <p className="text-center text-muted-foreground text-[11px]">Please enter your login credentials to access your account.</p>
                    </div>

                    <SigninForm />
                    <LabelSeparator label='or' className="bg-white my-2 text-[10px] font-medium text-muted-foreground" />
                    <SocialAuth />

                    <p className="text-center text-muted-foreground text-[11px]">{"Don't have an account? "}<Link className="text-primary font-semibold" href={Routes.signup}>Create an account</Link></p>
                    <p className="text-center text-muted-foreground text-[11px]">By continuing, you have read and agree to our <br /> <Link className="text-primary font-medium underline" href='/terms'>Terms and Conditions.</Link> </p>
                </div>
            </div>
        </div>
    )
}