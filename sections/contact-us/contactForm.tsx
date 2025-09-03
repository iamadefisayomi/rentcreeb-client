import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
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
import { contactFormSchema } from "./formSchema"
import { Textarea } from "@/components/ui/textarea"
import useAlert from "@/hooks/useAlert"
import { sendEmail } from "@/actions/sendEmail"
import { useNotificationStore } from "@/contexts/notificationStore"



export default function ContactUsForm () {

    const form = useForm<yup.InferType<typeof contactFormSchema>>({
        resolver: yupResolver(contactFormSchema),
        defaultValues: {}
      })

    const {setAlert} = useAlert()
    const {addNotification} = useNotificationStore()
    async function onSubmit(data: yup.InferType<typeof contactFormSchema>) {
        const {email, message, name, desiredDate, desiredTime} = data
        try {
            const res = await sendEmail({to: email, message, name, subject: `Dear ${name.split(' ')[0]}, we got your message.`})
            if (!res.success && res.message) throw new Error(res.message)
            setAlert('email sent', 'success')
            addNotification('You sent us a message', 'success')
            return form.reset({
                email: "",
                name: "",
                message: "",
                desiredDate: "",
                desiredTime: "",
              });
        }
        catch(err: any) {
            return setAlert(err.message, 'error')
        }
      }

    return (
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start gap-3 md:gap-4  w-full border rounded-2xl px-3 md:p-10 py-8 bg-white">
                <h2 className='text-md font-semibold capitalize md:hidden text-center w-full'>send a message</h2>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your name" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="my@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="w-full grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="desiredDate"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel>Desired Date</FormLabel>
                            <FormControl>
                                <Input type="date" className="bg-slate-50" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="desiredTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel>Desired Time</FormLabel>
                            <FormControl>
                                <Input type="time" className="w-full" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                            <Textarea placeholder="message" {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' loading={form.formState.isSubmitting} className="w-full md:h-11">
                    {form.formState.isSubmitting ? 'sending' : 'send'}
                </Button>

            </form>
        </Form>
    )
}