"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { signinSchema } from "./formSchemas"
import yup from 'yup'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import Routes from "@/Routes"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"


type SignupRenterFormData = yup.InferType<typeof signinSchema>;

export default function SigninForm () {

  const {emailSignin} = useAuth()
  const [viewPass, setViewPass] = useState(false)
  const form = useForm<SignupRenterFormData>({
    resolver: yupResolver(signinSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: SignupRenterFormData) => emailSignin(data)

    return (
        <div className=" w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="ml-2">Email</FormLabel>
                            <FormControl>
                                <Input type='email' className="bg-slate-50" placeholder="my@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="ml-2">Password</FormLabel>
                            <FormControl>
                              <div className="w-full relative bg-slate-50 items-center flex">
                              <Input type= {viewPass ? 'text' : 'password'} placeholder="Password" {...field} />
                              <div className="absolute right-2 cursor-pointer" onClick={() => setViewPass(prev => !prev)}>{ viewPass ? <Eye className="w-4" /> : <EyeOff className="w-4" /> }</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="w-full py-2 flex justify-between items-center gap-1">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="remember-me"
                                  className="w-4 h-4"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                                <label
                                  htmlFor="remember-me"
                                  className="text-[11px] text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Remember me
                                </label>
                              </div>
                              <Link
                                href={Routes.resetPassword}
                                className="text-primary text-[11px] font-medium hover:underline"
                              >
                                Forgot Password?
                              </Link>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    <Button disabled={form.formState.isSubmitting} loading={form.formState.isSubmitting} className="" size='lg'>
                        Continue
                    </Button>
                </form>
            </Form>
        </div>
    )
}