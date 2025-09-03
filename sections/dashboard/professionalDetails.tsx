"use client"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from 'yup'
import { professionalDetailsSchema, ProfessionalDetailType } from "./formSchemas";
import DropDownComp from "@/components/DropdownComp";
import { Textarea } from "@/components/ui/textarea";
import { _experienceOptions, _specializationOptions } from "@/_data/images";
import useAlert from "@/hooks/useAlert";
import { useEffect, useState } from "react";
import { isEqual } from "lodash-es";
import { updateProfessionalDetail } from "@/actions/professional";

export default function ProfessionalDetails({details, title}: {details: ProfessionalDetailType, title: string}) {

    const {setAlert} = useAlert()
    const form = useForm<yup.InferType<typeof professionalDetailsSchema>>({
        resolver: yupResolver(professionalDetailsSchema),
        defaultValues: {address: '', agency: '', bio: '', experience: '', license: '', specialization: ''}
      })
    // ---
    const watchedValues = useWatch({ control: form.control });
        const [dataChanged, setDataChanged] = useState(false)
    
        // ---
        async function onSubmit(data: yup.InferType<typeof professionalDetailsSchema>) {
            if (dataChanged) {
                const { success, message} = await updateProfessionalDetail(data as ProfessionalDetailType)
                if (!success && message) {
                    setAlert(message, 'error')
                }
                else setAlert('Updated successfuly', 'success')
                return setDataChanged(false)
            }
        }
        // 
        useEffect(() => {
            if (details) {
              form.reset(details);
            } 
          }, [details]);
          
          useEffect(() => {
            setDataChanged(!isEqual(watchedValues, details));
          }, [watchedValues, details]);
          

    return (
        <Form {...form}>
        <h2 className="text-xs font-semibold capitalize md:pb-5 pb-6">{title}</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 ">

             <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel className="text-[11px]">Years of Experience in Real Estate</FormLabel>
                    <FormControl>
                    <DropDownComp
                        title={field.value || " "}
                        className="border bg-slate-50 rounded-md lowercase"
                        component={
                        <div className="flex w-full flex-col gap-1 items-start">
                            {_experienceOptions.map((exp, index) => (
                            <Button
                                size="sm"
                                onClick={() => field.onChange(exp)}
                                variant="ghost"
                                key={index}
                                className="text-[11px] w-full flex justify-start items-center rounded-none lowercase"
                            >
                                {exp}
                            </Button>
                            ))}
                        </div>
                        }
                    />
                    </FormControl>
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel className="text-[11px]">Specialization</FormLabel>
                    <FormControl>
                    <DropDownComp
                        title={field.value || ''}
                        className="border bg-slate-50 rounded-md lowercase"
                        component={
                        <div className="flex w-full flex-col gap-1 items-start">
                            {_specializationOptions.map((exp, index) => (
                            <Button
                                size="sm"
                                onClick={() => field.onChange(exp)}
                                variant="ghost"
                                key={index}
                                className="text-[11px] w-full flex justify-start items-center rounded-none lowercase"
                            >
                                {exp}
                            </Button>
                            ))}
                        </div>
                        }
                    />
                    </FormControl>
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel className="text-[11px]">Professional Bio <span className="text-[10px] text-muted-foreground">{"(optional)"}</span></FormLabel>
                        <FormControl>
                            <Textarea rows={6} placeholder="Type your professional bio..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[11px]">Office address <span className="text-[10px] text-muted-foreground">{"(optional)"}</span></FormLabel>
                        <FormControl>
                            <Input placeholder="address..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="agency"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[11px]">Agency Affiliation <span className="text-[10px] text-muted-foreground">{"(optional)"}</span></FormLabel>
                        <FormControl>
                            <Input placeholder="agency..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="license"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel className="text-[11px]">Licenses and Certifications <span className="text-[10px] text-muted-foreground">{"(optional)"}</span></FormLabel>
                        <FormControl>
                            <Textarea rows={6} placeholder="Type your licence and certification..." {...field} />
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
    );
}


