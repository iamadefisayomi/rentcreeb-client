"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, useWatch  } from "react-hook-form"
import { socialsFormSchema, SocialsType } from "./formSchemas"
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
import { useCallback, useEffect, useMemo, useState } from "react"
import useAlert from "@/hooks/useAlert"
import { isEqual } from "lodash-es";
import { updateSocial } from "@/actions/social"


export default function SocialsComponent ({socials, title}: {socials: SocialsType, title: string}) {

   
    const form = useForm<yup.InferType<typeof socialsFormSchema>>({
        resolver: yupResolver(socialsFormSchema),
      })
      const {setAlert} = useAlert()
      const watchedValues = useWatch({ control: form.control });
    //   
    const dataChanged = useMemo(() => !isEqual(watchedValues, socials), [watchedValues, socials]);

    // ---
    const onSubmit = useCallback(async (data: yup.InferType<typeof socialsFormSchema>) => {
        if (dataChanged) {
          const { success, message } = await updateSocial(data);
          setAlert(success ? "Updated successfully" : message, success ? "success" : "error");
        }
      }, [dataChanged, setAlert]);
    //   
      useEffect(() => {
        if (socials) {
          form.reset(socials);
        } 
      }, [socials]);

      

    return (
        <Form {...form}>
            <h2 className="text-xs font-semibold capitalize pb-4">{title}</h2>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:gap-4 gap-6 w-full">
                <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px] font-medium text-muted-foreground">Facebook</FormLabel>
                        <FormControl>
                            <Input className="truncate bg-slate-50" type= 'url' placeholder="https://facebook.com/myusername" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px] font-medium text-muted-foreground">Linkedin</FormLabel>
                        <FormControl>
                            <Input type= 'url' className="truncate bg-slate-50"  placeholder="https://linkedin.com/myusername" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px] font-medium text-muted-foreground">Instagram</FormLabel>
                        <FormControl>
                            <Input type= 'url' className="truncate bg-slate-50"  placeholder="https://instagram.com/myusername" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="text-[11px] font-medium text-muted-foreground">Twitter</FormLabel>
                        <FormControl>
                            <Input type= 'url' className="truncate bg-slate-50"  placeholder="https://twitter.com/myusername" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button loading={form.formState.isSubmitting} variant={dataChanged ? 'default' : 'outline'} className="self-end md:w-fit w-full">
                    {dataChanged ? 'Save Changes' : "Updated"}
                </Button>
            </form>
        </Form>
    )
}