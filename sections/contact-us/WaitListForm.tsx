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
import { contactFormSchema, waitListFormSchema } from "./formSchema"
import { Textarea } from "@/components/ui/textarea"
import useAlert from "@/hooks/useAlert"
import { sendEmail } from "@/actions/sendEmail"
import { Construction, House, Key, MoveRight, Wrench } from "lucide-react"
import AddressAutocomplete from "../Autocomplete/AddressAutocomplete"
import { useEffect, useState } from "react"
import { joinWaitlist } from "@/actions/waitlist"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"



export default function WaitListForm () {

    const form = useForm<yup.InferType<typeof waitListFormSchema>>({
        resolver: yupResolver(waitListFormSchema),
        defaultValues: {}
      })

    const [location, setLocation] = useState<any>({});
      useEffect(() => {
        form.setValue("state", location.state || "");
        form.setValue("lga", location.lga || "");
        form.setValue("city", location.ward || "");
      }, [location, form]);

    const {setAlert} = useAlert()

    async function onSubmit(data: yup.InferType<typeof waitListFormSchema>) {
        console.log(data)
        try {
            const response = await joinWaitlist(data);

            if (!response.success) {
            throw new Error(response.message);
            }

            setAlert(
            "🎉 You're officially on the RentCreeb 2.0 waitlist!",
            "success"
            );

            form.reset({
                name: "",
                phone: "",
                message: "",
                email: "",
                state: "",
                lga: "",
                city: "",
                iAm: []
            });
            setLocation({});
        } catch (err: any) {
            setAlert(err.message || "Something went wrong.", "error");
        }
        }

    return (
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start gap-8  w-full border rounded-2xl px-3 md:p-10 py-8 bg-white">
                <span className="flex flex-col gap-1">
                    <h2 className='text-[16px] font-bold w-full'>Secure your spot</h2>
                    <p className="text-gray-500 text-[11px] text-center w-full">Takes about a minute. We'll reach out directly as onboarding opens.</p>
                </span>

                <div className="w-full grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel>Full Name<span className="text-red-500">{"*"}</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Adaeze okonkwo" {...field} />
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
                            <FormLabel>Email Address<span className="text-red-500">{"*"}</span></FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="adaezeokonkwo@rentcreeb.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="w-full grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel>Phone Number<span className="text-red-500">{"*"}</span></FormLabel>
                            <FormControl>
                                <Input placeholder="08123456789" {...field} type="tel" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full flex flex-col gap-1">
                        <p className="text-[11px] font-medium text-slate-800">City / Location <span className="text-red-500">{"*"}</span></p>
                        <AddressAutocomplete setLocation={setLocation} />
                    </div>
                </div>

                    <FormField
                    control={form.control}
                    name="iAm"
                    render={({ field }) => {
                        const valueArray = field.value || [];

                        return (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold md-1">
                            I am a...{" "}
                            <span className="text-red-500">
                                *
                            </span>
                            </FormLabel>

                            <FormControl>
                            <ul className="grid gap-4 md:grid-cols-4">
                            {_iAm.map((item) => (
                                <li key={item.title}>
                                {/* Hidden radio */}
                                <input
                                    id={item.title}
                                    type="radio"
                                    name={field.name}
                                    value={item.title}
                                    // checked={field.value === item.title}
                                    onChange={() => field.onChange(item.title)}
                                    className="peer hidden"
                                />

                                {/* Entire card becomes the radio */}
                                <label
                                    htmlFor={item.title}
                                    className="
                                    flex-col
                                    flex cursor-pointer items-center gap-4 rounded-xl border
                                    border-slate-200 bg-white p-5 transition-all
                                    hover:border-primary hover:bg-primary/5
                                    text-slate-700

                                    peer-checked:border-primary
                                    peer-checked:bg-primary
                                    peer-checked:text-white
                                    peer-checked:ring-2
                                    peer-checked:ring-primary/20
                                    "
                                >
                                    <div className="flex h-12 w-12  items-center justify-center rounded-lg">
                                    {item.icon}
                                    </div>

                                    <div>
                                    <p className="font-semibold capitalize text-[11px]  ">{item.title}</p>
                                    </div>
                                </label>
                                </li>
                            ))}
                            </ul>
                        </FormControl>

                            <FormMessage />
                        </FormItem>
                        );
                    }}
                    />


                <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => {
                        const valueArray = field.value || [];

                        return (
                        <FormItem className="w-full">
                            <FormLabel className="text-xs font-semibold capitalize">
                            Area of interest{" "}
                            <span className="text-[10px] font-light">
                                (Select all that apply)
                            </span>
                            </FormLabel>

                            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {_areaOfInterest.map((interest) => (
                                <label
                                key={interest}
                                htmlFor={interest}
                                className="flex items-center cursor-pointer space-x-3 border border-slate-300 p-3 rounded-xl"
                                >
                                <Checkbox
                                    id={interest}
                                    checked={valueArray.includes(interest)}
                                    onCheckedChange={(checked) => {
                                    if (checked) {
                                        field.onChange([...valueArray, interest]);
                                    } else {
                                        field.onChange(
                                        valueArray.filter(
                                            (item: string) => item !== interest
                                        )
                                        );
                                    }
                                    }}
                                />

                                <p
                                    className="leading-none text-slate-700 cursor-pointer capitalize text-[11px] font-medium"
                                >
                                    {interest}
                                </p>
                                </label>
                            ))}
                            </div>

                            <FormMessage />
                        </FormItem>
                        );
                    }}
                    />

                

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel>Anything you'd like to let us know <span className="text-[10px] font-light">{"(optional)"}</span></FormLabel>
                        <FormControl>
                            <Textarea placeholder="Tell us about your property needs, what you're hoping to find, or anything else..." {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' loading={form.formState.isSubmitting} className="w-full md:h-12">
                    {
                        form.formState.isSubmitting ? (
                            <span className="flex items-center gap-2">Joining the waitlist <MoveRight className="size-4 animate-spin" /> </span>
                        ) : (
                            <span className="flex items-center gap-2">Join the waitlist <MoveRight className="size-4" /> </span>
                        )
                    }
                </Button>

                <p className="text-gray-500 text-xs text-center w-full">No spam. We'll only reach out when it matters.</p>

            </form>
        </Form>
    )
}


const _areaOfInterest = [
    "verified landlords & tenants",
    "digital rental aggreements",
    "property management systems",
    "maintenance request & tracking",
    "verified artisan networks",
    "rent savings - RentKeepa"
]

const _iAm = [
    {
        title: 'landlord', icon: <House />
    },
    {
        title: 'renter / tenant', icon: <Key />
    },
    {
        title: 'artisan / service provider', icon: <Wrench />
    },
    {
        title: 'property developer', icon: <Construction />
    },
]