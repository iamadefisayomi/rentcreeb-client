import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { signupSchema } from "./formSchemas"
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
import { Eye, EyeOff, X } from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/useAuth"



type SignupRenterFormData = yup.InferType<typeof signupSchema>;

export default function SignupForm ({role}: {role: 'agent' | 'renter'}) {

  const {emailSignup} = useAuth()
  const [viewPass, setViewPass] = useState(false)
  const form = useForm<SignupRenterFormData>({
        resolver: yupResolver(signupSchema),
        defaultValues: {},
    });
  const [confirmEmail, setConfirmEmail] = useState(false)
  

    const onSubmit = async (data: SignupRenterFormData) => emailSignup({...data, setConfirmEmail, role})

    return (
        <div className=" w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 ">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel >Full Name</FormLabel>
                            <FormControl>
                                <Input type='text' className="bg-slate-50" placeholder="First name & Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel >Username</FormLabel>
                            <FormControl>
                                <Input type='text' className="bg-slate-50" placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel >Email</FormLabel>
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
                              <div className="w-full relative items-center flex bg-slate-50">
                              <Input type= {viewPass ? 'text' : 'password'} placeholder="Password" {...field} />
                              <div title={viewPass ? 'Hide Password' : 'Show Password'} className="absolute right-2 cursor-pointer" onClick={() => setViewPass(prev => !prev)}>{ viewPass ? <Eye className="w-3 text-primary" /> : <EyeOff className="w-3 text-primary" /> }</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={form.formState.isSubmitting} loading={form.formState.isSubmitting} className=" mt-2 capitalize">
                        Continue {role ? `as ${role}` : ''}
                    </Button>
                </form>
            </Form>
            <ConfirmEmailVerification confirmEmail={confirmEmail} />
        </div>
    )
}



type ConfirmEmailVerificationProps = {
  confirmEmail: boolean
}

export function ConfirmEmailVerification({ confirmEmail }: ConfirmEmailVerificationProps) {
  return (
    <AlertDialog open={confirmEmail}>
      <AlertDialogContent className="max-w-sm w-full p-6 rounded-2xl shadow-lg text-center flex flex-col items-center gap-5">
        <AlertDialogHeader className="w-full flex justify-between items-start">
          <div />
          {/* <AlertDialogCancel className="p-1 rounded-full hover:bg-muted aspect-square">
            <X className="h-4 w-4" />
          </AlertDialogCancel> */}
        </AlertDialogHeader>

        <img
          src="/confirmEmail.svg"
          alt="Check your email"
          className="w-44 h-44 object-contain"
        />

        <AlertDialogTitle className="text-base font-semibold">
          Verify Your Email
        </AlertDialogTitle>

        <AlertDialogDescription className="text-sm text-muted-foreground">
          To complete your signup, check your inbox and click the verification link we sent you.
        </AlertDialogDescription>

        <AlertDialogFooter />
      </AlertDialogContent>
    </AlertDialog>
  )
}
