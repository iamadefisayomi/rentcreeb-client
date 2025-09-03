"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import yup from 'yup'
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





export default function ChangePassword ({title}: {title: string}) {

    const {setAlert} = useAlert()
    const {user} = useAuth()
    const form = useForm<yup.InferType<typeof changePasswordFormSchema>>({
        resolver: yupResolver(changePasswordFormSchema),
        defaultValues: {oldPassword: '', password: '', confirmPassword: ''}
      })

    // ---
    async function onSubmit(data: yup.InferType<typeof changePasswordFormSchema>) {
            try {
                // const credential = EmailAuthProvider.credential(user?.email!, data.oldPassword);
                // await reauthenticateWithCredential(user as User, credential);

                // // Update password
                // await updatePassword(user as User, data.password);

                // setAlert("Password updated successfully!", "success");
                // form.reset();
            }
            catch(err: any) {
                return setAlert(err.message, 'error')
            }
      }
    
    return (
    <Form {...form}>
        <h2 className="text-xs font-semibold capitalize pb-4">{title}</h2>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px]">Old Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Old Password" {...field} />
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
                        <FormLabel className="text-[11px]">New Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="New Password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px]">Confirm Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Confirm Password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button loading={form.formState.isSubmitting} className="text-xs mt-4 rounded-md self-end w-fit">
                    Update Password
                </Button>
            </form>
        </Form>
    )
}