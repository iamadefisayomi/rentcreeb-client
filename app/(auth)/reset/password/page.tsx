"use client"

import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function ResetPasswordPage () {
    const router = useRouter()
    const [sending, setSending] = useState(false)
    const [email, setEmail] = useState('')
    const {resetPasswordRequest} = useAuth()

    const handleResetPassword = async () => {
        setSending(true)
        await resetPasswordRequest(email)
        setEmail("")
        setSending(false)
    }
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
                        <h2 className="capitalize text-primary font-bold text-xl">Reset Password</h2>
                        <p className="text-center text-muted-foreground text-[11px]">Please enter your account email to continue.</p>
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <Input disabled={sending} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" type='email' required/>
                        <Button loading={sending} disabled={sending} size='sm' onClick={handleResetPassword}>Continue</Button>
                    </div>

                    <p className="text-center text-muted-foreground text-[11px]">By continuing, you have read and agree to our <br /> <Link className="text-primary font-medium underline" href='/terms'>Terms and Conditions.</Link> </p>
                </div>
            </div>
        </div>
    )
}