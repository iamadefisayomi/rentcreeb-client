"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Loading from "@/app/loading"

export default function NotFound() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const status = searchParams.get("status")

    if (status === "coming-soon") {
      // Optimistically redirect without waiting for a re-render
      router.replace("/coming-soon")
    } else {
      // No redirect, render the 404 page
      setChecking(false)
    }
  }, [searchParams, router])

  if (checking) {
    // Skeleton loader while "optimistically" checking the status
    return (
      <Loading />
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="sr-only">404 - Page Not Found | RentCreeb INC.</h1>
      <p className="sr-only">The page you are looking for does not exist or has been moved.</p>

      <Image
        src="/error404.png"
        className="w-48 sm:w-64 h-auto"
        draggable={false}
        alt="Page not found"
        loading="lazy"
        width={200}
        height={200}
      />

      <div className="mt-6 flex flex-col items-center gap-6">
        <h2 className="text-4xl font-semibold text-slate-800" aria-label="404 - Page Not Found">
          Oops!!!.
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          The page you are looking for could not be found.
        </p>
        <Link href="/">
          <Button className="px-4 flex items-center gap-2">
            <ChevronLeft className="w-3" /> Back To Home
          </Button>
        </Link>
      </div>
    </main>
  )
}
