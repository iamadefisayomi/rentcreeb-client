"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"



export default function WaitlistModal() {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();

    // if (pathname === "/waitlist") {
    //     return null;
    // }

    useEffect(() => {
        if (pathname === "/waitlist") {
            setOpen(false);
            return;
        }

        const seen = localStorage.getItem("rentcreeb_waitlist");

        if (!seen) {
            const timer = setTimeout(() => {
                setOpen(true);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [pathname]);

    function close() {
        localStorage.setItem("rentcreeb_waitlist", "true");
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent
                // showCloseButton={false}
                className="max-w-lg overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl"
            >
                <div className="relative overflow-hidden">

                    {/* Animated gradient base */}
                    <div className="absolute inset-0 animate-[gradient-shift_10s_ease_infinite] bg-[linear-gradient(120deg,#4338ca,#3b63f0,#6d28d9,#2563eb)] bg-[length:300%_300%]" />

                    {/* Floating glow orbs */}
                    <div className="absolute -top-16 -right-10 h-56 w-56 animate-[float-slow_7s_ease-in-out_infinite] rounded-full bg-white/25 blur-3xl" />
                    <div className="absolute -bottom-20 -left-10 h-64 w-64 animate-[float-slow_9s_ease-in-out_infinite_1s] rounded-full bg-fuchsia-400/25 blur-3xl" />
                    <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 animate-[float-slow_8s_ease-in-out_infinite_0.5s] rounded-full bg-sky-300/20 blur-3xl" />

                    {/* Subtle grid texture */}
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage:
                                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />

                    {/* Close button */}
                    <button
                        onClick={close}
                        aria-label="Close"
                        className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur transition hover:rotate-90 hover:bg-white/20 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="relative px-9 py-12 sm:px-11 sm:py-14">

                        {/* Badge */}
                        <div className="mb-6 inline-flex animate-[fade-up_0.6s_ease_forwards] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 opacity-0 backdrop-blur [animation-delay:100ms]">
                            <Sparkles className="h-3.5 w-3.5 animate-[sparkle-pulse_2.4s_ease-in-out_infinite] text-white" />
                            <span className="text-xs font-medium tracking-wide text-white/90">
                                Coming soon
                            </span>
                        </div>

                        <h2 className="animate-[fade-up_0.6s_ease_forwards] text-4xl font-bold tracking-tight text-white opacity-0 sm:text-[2.75rem] sm:leading-[1.05] [animation-delay:200ms]">
                            RentCreeb 2.0
                        </h2>

                        <p className="mt-4 animate-[fade-up_0.6s_ease_forwards] text-lg text-white/90 opacity-0 [animation-delay:300ms]">
                            We&apos;re building Nigeria&apos;s smartest real estate platform.
                        </p>

                        <p className="mt-2 max-w-lg animate-[fade-up_0.6s_ease_forwards] text-white/70 opacity-0 [animation-delay:380ms]">
                            Join thousands already on the waitlist and get exclusive
                            early access before launch.
                        </p>

                        {/* Social proof */}
                        <div className="mt-7 flex animate-[fade-up_0.6s_ease_forwards] items-center gap-3 opacity-0 [animation-delay:460ms]">
                            <div className="flex -space-x-2.5">
                                {/* {["bg-amber-300", "bg-rose-300", "bg-emerald-300", "bg-sky-300"].map(
                                    (color, i) => (
                                        <div
                                            key={i}
                                            className={`h-8 w-8 rounded-full ${color} ring-2 ring-indigo-600/80`}
                                        />
                                    )
                                )} */}
                                <AvatarGroup>
                                    {
                                        propUsers.map((user, index) => (
                                        <Avatar key={index}>
                                            <AvatarImage className="object-cover rounded-full flex" src={user} alt="prop-user" />
                                            <AvatarFallback>RC</AvatarFallback>
                                        </Avatar>
                                        ))
                                    }
                                </AvatarGroup>
                            </div>
                            <p className="text-sm text-white/80">
                                <span className="font-semibold text-white">2,400+</span> people
                                already joined
                            </p>
                        </div>

                        <div className="mt-9 flex animate-[fade-up_0.6s_ease_forwards] flex-col gap-3 opacity-0 [animation-delay:540ms] sm:flex-row">

                            <Button
                                asChild
                                size="lg"
                                className="group relative overflow-hidden bg-white text-primary shadow-lg shadow-black/10 transition-transform hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
                            >
                                <Link href="/waitlist">
                                    Join the Waitlist
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>

                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={close}
                                className="text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                Continue to Website
                            </Button>

                        </div>

                        <p className="mt-8 animate-[fade-up_0.6s_ease_forwards] text-sm text-white/60 opacity-0 [animation-delay:620ms]">
                            Early members receive exclusive launch updates and
                            priority access.
                        </p>

                    </div>

                </div>

            </DialogContent>
        </Dialog>
    );
}


const propUsers = [
  "https://images.unsplash.com/photo-1566165335512-bb5ba58365b4?q=80&w=710&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1585532487868-ae1ab18246d0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1624605327959-6986705cb194?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1773592617583-6c56c05a9239?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1678737210578-eaf634c8d342?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];