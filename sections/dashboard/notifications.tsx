"use client"


import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, useWatch  } from "react-hook-form"
import { notificationsSchema, NotificationType } from "./formSchemas"
import yup from 'yup'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import useAlert from "@/hooks/useAlert"
import { isEqual } from "lodash-es";








export default function Notifications ({notify, title}: {notify: NotificationType, title: string}) {

   
    const form = useForm<yup.InferType<typeof notificationsSchema>>({
        resolver: yupResolver(notificationsSchema),
        defaultValues : {
            getNews: notify?.getNews ?? true,
            getAccountUpdate: notify?.getAccountUpdate ?? true,
            getClientEmail: notify?.getClientEmail ?? true,
            getMeetupNews: notify?.getMeetupNews ?? false,
            getListingUpdates: notify?.getListingUpdates ?? false,
            getInquiryNotification: notify?.getInquiryNotification ?? true,
            getCommentNotification: notify?.getCommentNotification ?? false,
            getMentionNotification: notify?.getMentionNotification ?? true,
            getExpiryNotification: notify?.getExpiryNotification ?? false,
            getScheduleNotification: notify?.getScheduleNotification ?? true,
            getBookmarkNotification: notify?.getBookmarkNotification ?? false,
            getMarketInsight: notify?.getMarketInsight ?? true,
            getOpportunity: notify?.getOpportunity ?? false,
            getInsiderNews: notify?.getInsiderNews ?? false,
            getInspirations: notify?.getInspirations ?? false,
        }
      })
      const {setAlert} = useAlert()
      const watchedValues = useWatch({ control: form.control });
      const [allChecked, setAllChecked] = useState(false);
    //   
      const handleToggleAll = () => {
        const newCheckedState = !allChecked;
        Object.keys(form.getValues()).forEach((key) => {
          form.setValue(key as keyof yup.InferType<typeof notificationsSchema>, newCheckedState);
        });
        setAllChecked(newCheckedState);
      };
    //   
      const [dataChanged, setDataChanged] = useState(false)

    // ---
    async function onSubmit(data: yup.InferType<typeof notificationsSchema>) {
            // if (dataChanged) {
            //     const { success, message} = await updateNotifications(data)
            //     if (!success && message) {
            //         setAlert(message, 'error')
            //     }
            //     else setAlert('Updated successfuly', 'success')
            //     return setDataChanged(false)
            // }
      }

    //
    useEffect(() => {
    setDataChanged(!isEqual(watchedValues, notify));
    }, [watchedValues, notify]);
    //   

    return (
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10 w-full">
                <div className="flex flex-col gap-4 w-full ">
                    <div className="w-full flex items-center justify-between border-b ">
                        <h2 className="text-xs font-semibold capitalize">{title}</h2>
                        <Button variant="link" className="text-gray-700" size="sm" onClick={handleToggleAll}>
                            {allChecked ? "Uncheck All" : "Toggle All"}
                        </Button>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <h2 className="text-[11px] text-gray-700 font-medium">Send me:</h2>

                        <FormField
                            control={form.control}
                            name="getNews"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="property market news"
                                        description="Get news, announcements, and updates about the property market."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getClientEmail"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="client inquiries"
                                        description="Receive emails from prospective clients looking for rental properties."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getMeetupNews"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="meetups near you"
                                        description="Get an email when a real estate meetup is posted close to your location."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getListingUpdates"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="rental listing updates"
                                        description="Get news and announcements for rental listings and market trends."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                </div>

                {/* -------------------------------------------- */}


                <div className="flex flex-col gap-4 w-full ">
                    <div className="w-full flex items-center justify-between border-b ">
                        <h2 className="text-xs font-semibold capitalize">account activities</h2>
                        <Button variant="link" className="text-gray-700" size="sm" onClick={handleToggleAll}>
                            {allChecked ? "Uncheck All" : "Toggle All"}
                        </Button>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <h2 className="text-[11px] text-gray-700 font-medium">Email me when:</h2>

                        <FormField
                            control={form.control}
                            name="getInquiryNotification"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="Someone inquire about one of my listed property."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getCommentNotification"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="Someone comments on one of my property listings."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getMentionNotification"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="Someone mentions me in a property-related discussion."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getExpiryNotification"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="My listings are about to expire."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getScheduleNotification"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="Someone schedules a property viewing."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getBookmarkNotification"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="Anyone bookmarks my property listings."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                </div>

                {/* ------------------------------------------------------- */}

                <div className="flex flex-col gap-4 w-full ">
                    <div className="w-full flex items-center justify-between border-b ">
                        <h2 className="text-xs font-semibold capitalize">weekly newsletters</h2>
                        <Button variant="link" className="text-gray-700" size="sm" onClick={handleToggleAll}>
                            {allChecked ? "Uncheck All" : "Toggle All"}
                        </Button>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <h2 className="text-[11px] text-gray-700 font-medium">Subscribe me to:</h2>

                        <FormField
                            control={form.control}
                            name="getMarketInsight"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="Market insights"
                                        description="Monday: Insights and analysis of the current property rental market."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getOpportunity"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="Opportunities"
                                        description="Tuesday: New rental opportunities and property listings."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getInsiderNews"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="Real Estate Insider"
                                        description="Wednesday: Latest real estate news & community highlights."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="getInspirations"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormControl>
                                    <NotifyComponent 
                                        label="Property inspirations"
                                        description="Monday: A weekly collection of property design and decor inspiration."
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                </div>

                

                <Button loading={form.formState.isSubmitting} variant={dataChanged ? 'default' : 'outline'} className="self-end md:w-fit w-full">
                    {dataChanged ? 'Save Changes' : "Updated"}
                </Button>
            </form>
        </Form>
    )
}



const NotifyComponent = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label?: string;
    description?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
  }) => {
    return (
      <div className="w-full flex gap-2 items-start">
        <Checkbox id={label} name={label} checked={checked} onCheckedChange={onChange} />
        <label htmlFor={label} className="w-full flex items-start text-muted-foreground flex-col gap-1">
          {label && <h2 className="text-[11px] capitalize font-medium text-gray-700">{label}</h2>}
          {description && <h2 className="text-[10px] capitalize font-medium text-muted-foreground">{description}</h2>}
        </label>
      </div>
    );
  };