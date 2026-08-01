"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { changePasswordFormSchema } from "@/sections/dashboard/formSchemas"
import useAlert from "@/hooks/useAlert"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"

export default function AccountSettings() {
  const { setAlert } = useAlert()
  const {
    user,
    loginWithSocial,
    listAccounts,
    unlinkAccount,
    linkEmailPassword // 👈 YOU WILL ADD THIS
  } = useAuth()

  const [accounts, setAccounts] = useState<any[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)

  // -------------------------
  // Fetch accounts
  // -------------------------
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await listAccounts()
        if (res?.data) setAccounts(res.data)
      } catch (err: any) {
        setAlert(err.message, "error")
      } finally {
        setLoadingAccounts(false)
      }
    }

    fetchAccounts()
  }, [])

  // -------------------------
  // Derived state
  // -------------------------
  const connectedProviders = accounts.map((acc) => acc.provider)

  const hasPasswordAccount =
    connectedProviders.includes("email") ||
    connectedProviders.includes("credentials")

  const providers = ["google", "facebook", "twitter"]

  // -------------------------
  // PASSWORD FORM
  // -------------------------
  const passwordForm = useForm<yup.InferType<typeof changePasswordFormSchema>>({
    resolver: yupResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onPasswordChange(data: any) {
    try {
      // call backend
      setAlert("Password updated successfully", "success")
      passwordForm.reset()
    } catch (err: any) {
      setAlert(err.message, "error")
    }
  }

  // -------------------------
  // ADD PASSWORD FORM (for OAuth users)
  // -------------------------
  const addPasswordForm = useForm({
    defaultValues: {
      email: user?.email || "",
      password: "",
    },
  })

  async function handleAddPassword(data: any) {
    try {
      await linkEmailPassword(data)
      setAlert("Password added successfully", "success")
    } catch (err: any) {
      setAlert(err.message, "error")
    }
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="flex flex-col gap-8 w-full max-w-[600px]">

      {/* ================= USER INFO ================= */}
      <div className="border rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-2">Account Info</h2>

        <p className="text-xs">
          Email: <span className="text-primary">{user?.email}</span>
        </p>

        <p className="text-xs">
          Account Type:{" "}
          <span className="capitalize text-primary">{user?.accountType}</span>
        </p>
      </div>

      {/* ================= CONNECT ACCOUNTS ================= */}
      <div className="border rounded-lg p-4 flex flex-col gap-4">
        <h2 className="text-sm font-semibold">Connected Accounts</h2>

        {loadingAccounts ? (
          <p className="text-xs">Loading...</p>
        ) : (
          <>
            {/* SOCIAL PROVIDERS */}
            {providers.map((provider) => {
              const isConnected = connectedProviders.includes(provider)

              return (
                <div
                  key={provider}
                  className="flex justify-between items-center border p-2 rounded-md"
                >
                  <p className="text-xs capitalize">{provider}</p>

                  {isConnected ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => unlinkAccount(provider)}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => loginWithSocial(provider as any)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              )
            })}

            {/* EMAIL / PASSWORD */}
            <div className="border p-3 rounded-md flex flex-col gap-2">
              <p className="text-xs font-medium">Email & Password</p>

              {hasPasswordAccount ? (
                <p className="text-xs text-green-600">
                  Password login enabled
                </p>
              ) : (
                <Form {...addPasswordForm}>
                  <form
                    onSubmit={addPasswordForm.handleSubmit(handleAddPassword)}
                    className="flex flex-col gap-2"
                  >
                    <Input
                      placeholder="Email"
                      {...addPasswordForm.register("email")}
                    />
                    <Input
                      type="password"
                      placeholder="Set Password"
                      {...addPasswordForm.register("password")}
                    />

                    <Button size="sm">Add Password</Button>
                  </form>
                </Form>
              )}
            </div>
          </>
        )}
      </div>

      {/* ================= CHANGE PASSWORD ================= */}
      {hasPasswordAccount && (
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Change Password</h2>

          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordChange)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Old Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                loading={passwordForm.formState.isSubmitting}
                className="self-end"
              >
                Update Password
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}