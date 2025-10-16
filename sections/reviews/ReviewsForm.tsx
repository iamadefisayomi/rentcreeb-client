"use client"

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
import { reviewFormSchema } from "./formSchema"
import { Textarea } from "@/components/ui/textarea"
import Rating from "@/components/Rating"
import useAlert from "@/hooks/useAlert"
import { addReview } from "@/actions/reviews"



export default function ReviewsForm ({propertyId}: {propertyId: string}) {

    const form = useForm<yup.InferType<typeof reviewFormSchema>>({
        resolver: yupResolver(reviewFormSchema),
        defaultValues: {},
        mode: 'onSubmit'
      })
    const {setAlert} = useAlert()
    // ---
    async function onSubmit(data: yup.InferType<typeof reviewFormSchema>) {
        try {
            const {message, rating} = data
            const res = await addReview({rating, message, propertyId})
            if (!res?.success) throw new Error(res?.message)
                form.reset()
            return setAlert('review successfuly added', 'success')
        }
        catch(err: any) {
            return setAlert(err.message, 'warning')
        }
      }

    return (
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start gap-4 shadow-[4px_3px_44px_3px_rgba(0,_0,_0,_0.1)]  w-full border rounded-2xl p-10 py-8 bg-white">
                
                <div className="w-full flex flex-col gap-1 items-start">
                    <h2 className='text-md text-slate-800 font-bold text-center'>Leave a review</h2>
                    <p className="text-xs text-muted-foreground ">Share your inspection experience</p>
                </div>
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                            <Rating 
                                className="text-primary" 
                                fill='white' 
                                length={5}
                                setValue={field.onChange}
                                value={field.value}
                            />
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
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                            <Textarea placeholder="What should others know?" {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />


                <Button loading={form.formState.isSubmitting} className="w-full md:h-11 rounded-xl">
                    {form.formState.isSubmitting ? 'Submitting review' : 'Submit Review'}
                </Button>

            </form>
        </Form>
    )
}