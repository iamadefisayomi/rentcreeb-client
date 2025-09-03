"use client"

import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Routes from "@/Routes"
import { Dot } from "lucide-react"
import Link from "next/link"


export default function ComingSoon () {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-between bg-slate-900">

            <div className="w-full flex items-end gap-2 max-w-8xl py-4 justify-between px-4">
                <Logo isDark/>

                <div className="flex items-center gap-2">
                    <Link href={Routes.home} className="text-xs text-muted font-medium capitalize">
                        Home
                    </Link>
                    <Dot className="text-primary" />
                    <Link href={Routes.contact} className="text-xs text-muted font-medium capitalize">
                        contact
                    </Link>
                    <Dot className="text-primary" />
                     <Link href={Routes.aboutUs} className="text-xs text-muted font-medium capitalize">
                        About
                    </Link>
                    <Dot className="text-primary" />
                     <Link href={Routes.services} className="text-xs text-muted font-medium capitalize">
                        support
                    </Link>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold pb-4 leading-tight">
                    🚀<span className="bg-gradient-to-r from-indigo-500 via-purple-500 text-center to-pink-500 bg-clip-text text-transparent">Coming Soon</span>
                    
                </h1>
                
                <p className="text-xs text-muted max-w-sm">
                    {"We’re working hard to bring you something amazing. Be the first to know when we launch!"}
                </p>

                <div className="w-full max-w-md relative flex items-center">
                    <Input 
                    placeholder="Enter your email address" 
                    className="pr-28 py-5 text-base"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <Button size="sm" className="rounded-[6px] px-4 py-2">
                        Notify Me
                    </Button>
                    </div>
                </div>

                <p className="text-xs text-muted">
                    No spam. Only updates about our launch.
                </p>
            </div>


            <footer className="w-full max-w-8xl flex items-center justify-between gap-2 py-4">
                <Link href='#' className="text-xs text-muted font-medium capitalize">
                    privacy policy
                </Link>

                <div className="flex items-center gap-2">
                    <Link href={Routes.contact} className="text-xs text-muted font-medium capitalize">
                        facebook
                    </Link>
                    <Dot className="text-primary" />
                     <Link href={Routes.aboutUs} className="text-xs text-muted font-medium capitalize">
                        instagram
                    </Link>
                    <Dot className="text-primary" />
                     <Link href={Routes.services} className="text-xs text-muted font-medium capitalize">
                        linkedin
                    </Link>
                </div>
            </footer>
        </div>
    )
}