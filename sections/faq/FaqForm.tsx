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
import { faqFormSchema } from "./formSchema"
import { Textarea } from "@/components/ui/textarea"



export default function FaqForm () {

    const form = useForm<yup.InferType<typeof faqFormSchema>>({
        resolver: yupResolver(faqFormSchema),
        defaultValues: {}
      })
    // ---
    async function onSubmit(data: yup.InferType<typeof faqFormSchema>) {
        const {email} = data
        await console.log(email)
      }

    return (
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start gap-2 md:gap-4 sm:max-w-sm md:max-w-xs shadow-[4px_3px_44px_3px_rgba(0,_0,_0,_0.1)]  w-full border rounded-2xl px-3 md:p-10 py-8 bg-white">
                <h2 className='text-md text-slate-800 font-bold text-center w-full p-0 -mb-2'>Didn't find any answer?</h2>
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

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input type="tel" className="w-full bg-slate-50" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Type your message" {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />


                <Button className="w-full md:h-11 rounded-xl">Send</Button>

            </form>
        </Form>
    )
}