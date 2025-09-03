"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

import Logo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useAlert from "@/hooks/useAlert"
import { useAuth } from "@/hooks/useAuth"

export default function NewPasswordPage() {
  const { resetPasswordConfirm } = useAuth()
  const { setAlert } = useAlert()

  const [resetting, setResetting] = useState(false)
  const [password, setPassword] = useState('')
  const [viewPass, setViewPass] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token")
    setToken(urlToken)
  }, [])

  const handleResetPasswordConfirm = async () => {
    if (!password || password.trim().length < 8) {
      return setAlert('Password length must be at least 8 characters', 'error')
    }
    if (!token) {
      return setAlert('Invalid or missing token', 'error')
    }
    setResetting(true)
    await resetPasswordConfirm({ token, newPassword: password })
    setResetting(false)
  }

  return (
    <div className="w-full min-h-screen px-2 bg-slate-50 flex flex-col items-center">
      <div className="w-full flex items-center justify-center gap-2 max-w-7xl mx-auto sticky top-0 py-5 bg-slate-50">
        <Logo />
      </div>

      <div className="w-full py-10 max-w-md flex-grow flex items-center justify-center">
        <div className="rounded-md border bg-white flex flex-col gap-6 w-full p-6 md:px-8">
          <div className="w-full flex flex-col items-center gap-1">
            <h2 className="capitalize text-primary font-bold text-xl">New Password</h2>
            <p className="text-center text-muted-foreground text-[11px]">
              Please enter a secure password to continue.
            </p>
          </div>

          <div className="w-full flex items-center gap-2">
            <div className="w-full relative flex items-center bg-slate-50">
              <Input
                disabled={resetting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={viewPass ? "text" : "password"}
                placeholder="New Password"
              />
              <div
                role="button"
                aria-label={viewPass ? "Hide Password" : "Show Password"}
                title={viewPass ? "Hide Password" : "Show Password"}
                className="absolute right-2 cursor-pointer"
                onClick={() => setViewPass((prev) => !prev)}
              >
                {viewPass ? (
                  <Eye className="w-4 text-primary" />
                ) : (
                  <EyeOff className="w-4 text-primary" />
                )}
              </div>
            </div>
            <Button disabled={resetting} loading={resetting} size="sm" onClick={handleResetPasswordConfirm}>
              Reset
            </Button>
          </div>

          <p className="text-center text-muted-foreground text-[11px]">
            By continuing, you agree to our <br />
            <Link href="/terms" className="text-primary font-medium underline">
              Terms and Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
