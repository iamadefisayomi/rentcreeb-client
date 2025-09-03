"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { newPropertySchema, NewPropertySchemaType } from "./formSchemas"
import yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import useAlert from "@/hooks/useAlert"
import { Input } from "@/components/ui/input"
import DropDownComp from "@/components/DropdownComp"
import { _generalAmenities, _listedIn, _propertyStatus, _propertyTypes, ELECTRICITY, FIELD_NAMES, FURNISHED_OPTIONS, PROPERTY_CONDITIONS, WATER_SUPPLY } from "@/_data/_propertyDefault"
import { Button } from "@/components/ui/button"
import NewPropImagesUploader from "./NewPropertyImageUploader"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { NumericFormat } from "react-number-format"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { NEXT_PUBLIC_BASE_URL } from "@/constants"
import { createNewProperty, updateProperty } from "@/actions/properties"
import { useParams } from "next/navigation"
const AddPropertyMap = dynamic(() => import('@/components/AddPropertyMap'), { ssr: false });


interface Ward {
  name?: string;
  latitude?: number;
  longitude?: number;
}

interface LGA {
  name?: string;
  wards?: Ward[];
  latitude?: number;
  longitude?: number;
}

interface StateData {
  state?: string;
  lgas?: LGA[];
  latitude?: number;
  longitude?: number;
}

interface LocationItem {
  state?: string;
  lga?: string;
  ward?: string;
  coordinates?: [number, number]; // [longitude, latitude]
}



export default function PropertyForm ({type, defaultValues}: {type: 'new' | 'edit', defaultValues?: NewPropertySchemaType}) {

    const form = useForm<yup.InferType<typeof newPropertySchema>>({
        resolver: yupResolver(newPropertySchema),
        defaultValues: type === 'new' ? {} : defaultValues as NewPropertySchemaType
    })
    const {setAlert} = useAlert()
    const [locationsList, setLocationsList] = useState<any[]>([]);
    const [lgaList, setLgaList] = useState<{ name: string; wards?: { name: string }[] }[]>([]);
    const [wardList, setWardList] = useState<{ name: string }[]>([]);
    const param = useParams()

    // Load LGAs when state changes
    useEffect(() => {
        const stateValue = form.watch("state");
        const stateData = locationsList.find((s) => s.state === stateValue);
        setLgaList(stateData?.lgas || []);
        form.setValue("lga", "");
        form.setValue("city", "");
        setWardList([]);
    }, [form.watch("state")]);

    // Load Wards when LGA changes
    useEffect(() => {
        const lgaValue = form.watch("lga");
        const selectedLga = lgaList.find((l) => l.name === lgaValue);
        setWardList(selectedLga?.wards || []);
        form.setValue("city", "");
    }, [form.watch("lga")]);

    // set coordinates when ward changes
    useEffect(() => {
    const wardObj = wardList.find(w => w.name === form.getValues("city")) as Ward;
     if (wardObj && wardObj.latitude && wardObj.longitude) {
    form.setValue("location", {
        type: "Point",
        coordinates: [wardObj.longitude, wardObj.latitude], // [lng, lat]
        });
    }
  }, [wardList, form.watch("city")]);


    useEffect(() => {
        const fetchLocations = async () => {
          try {
            const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/states-data`, {
              cache: 'force-cache',
            });
    
            if (!res.ok) throw new Error('Failed to fetch states data');
    
            const data: {
              success: boolean;
              message: string;
              data: StateData[];
            } = await res.json();
    
            if (!data.success) throw new Error(data.message);
            setLocationsList(data.data);
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
        };
    
        fetchLocations();
      }, []);

    // handle form submit
    async function onSubmit (data: yup.InferType<typeof newPropertySchema>) {
        try {
            if (type === 'new') {
                const res = await createNewProperty(data)
                if (!res.success) throw new Error(res.message)
                // 
                setAlert(res.message, 'success')
                form.reset()
                return 
            }
            else if (type === 'edit') {
                if (!param?.id || typeof param.id !== "string") {
                    throw new Error("Invalid or missing property ID");
                    }
                    
                const { success, message } = await updateProperty(param.id, data);
                if (!success && message) throw new Error(message)
                // 
                setAlert(message, 'success')
                return 
            }
            return
        }
        catch(err: any) {
            return setAlert(err.message, 'error')
        }
    }


    return (
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
                {/* Basic information */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">basic information</h2>

                    <div className="w-full grid grid-cols-3 gap-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="w-full col-span-2">
                                <FormLabel className="">Property Title*</FormLabel>
                                <FormControl>
                                    <Input {...field} className='bg-slate-50' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                            <FormItem className="w-full col-span-1">
                                <FormLabel className="">Property Type*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || 'all'}
                                    className="border bg-slate-50 capitalize rounded-md"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {Object.entries(_propertyTypes).map(([key, value], index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(value)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none lowercase"
                                        >
                                            {key}
                                        </Button>
                                        ))}
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Description*</FormLabel>
                                <FormControl >
                                    <div className="w-full items-end flex flex-col gap-2">
                                    <Textarea rows={10}  placeholder="Type your description..." {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full grid gap-2 grid-cols-2">
                        <FormField
                            control={form.control}
                            name="listedIn"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Listed in*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || _listedIn.rent}
                                    
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {Object.entries(_listedIn).map(([key, value], index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(value)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                        >
                                            {key}
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
                            name="status"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Status*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value}
                                    
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {Object.entries(_propertyStatus).map(([key, value], index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(key)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                        >
                                            {key}
                                        </Button>
                                        ))}
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Additional information */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">Pricing & Features</h2>
                        
                    <div className="w-full grid gap-2 grid-cols-2">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>{"Price*(₦)"}</FormLabel>
                                <FormControl>
                                    <NumericFormat
                                        value={field.value ?? ""}
                                        thousandSeparator
                                        allowNegative={false}
                                        inputMode="numeric"
                                        customInput={Input}
                                        className="bg-slate-50 w-full"
                                        onValueChange={(values) => {
                                            // Only update with a valid floatValue
                                            field.onChange(values.floatValue ?? "");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                        <FormField
                            control={form.control}
                            name="taxRate"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Yearly Tax Rate*</FormLabel>
                                <FormControl>
                                    <Input value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))} className='bg-slate-50' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full grid md:grid-cols-4 grid-cols-1 gap-2">
                    {
                        FIELD_NAMES.map((res, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={res}
                                render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="capitalize">{res}*</FormLabel>
                                    <FormControl>
                                    <DropDownComp
                                        title={field.value || 1}
                                        
                                        component={
                                        <div className="flex w-full flex-col gap-1 items-start">
                                            {Array.from({length: 10}).map((_, index) => (
                                            <Button
                                                size="sm"
                                                onClick={() => field.onChange(index + 1)}
                                                variant="ghost"
                                                key={index}
                                                className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                            >
                                                {index + 1}
                                            </Button>
                                            ))}
                                        </div>
                                        }
                                    />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                        ))
                    }
                    </div>
                </div>

                {/*Location*/}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">address & location</h2>

                    <div className="w-full grid gap-2 grid-cols-2">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem >
                                <FormLabel className="">Country*</FormLabel>
                                <FormControl>
                                    <Input value='Nigeria' readOnly />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="">State*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || 'select state'}
                                    
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {
                                            locationsList.map((res, index) => (
                                                <Button
                                                    size="sm"
                                                    onClick={() => field.onChange(res.state)}
                                                    variant="ghost"
                                                    key={index}
                                                    className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                                >
                                                    {res.state}
                                                </Button>
                                            ))
                                        }
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full grid gap-2 grid-cols-2">
                        <FormField
                            control={form.control}
                            name="lga"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Local Government Area*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || 'select lga'}
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {
                                            lgaList.map((lga, index) => (
                                                <Button
                                                    size="sm"
                                                    onClick={() => field.onChange(lga.name)}
                                                    variant="ghost"
                                                    key={index}
                                                    className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                                >
                                                    {lga.name}
                                                </Button>
                                            ))
                                        }
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">City*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || 'select city'}
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {
                                            wardList.map((res, index) => (
                                                <Button
                                                    size="sm"
                                                    onClick={() => field.onChange(res.name)}
                                                    variant="ghost"
                                                    key={index}
                                                    className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                                >
                                                    {res.name}
                                                </Button>
                                            ))
                                        }
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="">Full Address*</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full grid gap-2 grid-cols-2">
                        <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Zip</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="23143"  />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="">Map Location</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly
                                        value={
                                        field.value?.coordinates
                                            ? `${field.value.coordinates[1]}, ${field.value.coordinates[0]}`
                                            : ""
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full h-80 border bg-slate-50 rounded-lg">
                        <AddPropertyMap
                            position={[
                                form.getValues("location")?.coordinates?.[1] || 0,
                                form.getValues("location")?.coordinates?.[0] || 0
                            ]}
                            address={form.watch("address")}
                            className="h-80 rounded-lg"
                        />

                    </div>
                </div>

                {/* Media*/}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">Media</h2>

                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormMessage />
                            <FormControl>
                                <NewPropImagesUploader
                                images={Array.isArray(field.value) ? field.value.filter((img): img is File | string => img instanceof File || typeof img === "string") : []}
                                setImages={(newImages: (File | string)[]) => {
                                    field.onChange(newImages); // Ensure both File and URL strings are handled
                                }}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />

                    
                    <div className="w-full grid grid-cols-3 gap-2">
                    <FormField
                        control={form.control}
                        name="videoFrom"
                        render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="">Video From</FormLabel>
                            <FormControl>
                                <DropDownComp
                                    title={field.value || 'youtube'}
                                    
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {["vimeo", "youtube"].map((type, index) => (
                                                <Button
                                                    size="sm"
                                                    onClick={() => field.onChange(type)}
                                                    variant="ghost"
                                                    key={index}
                                                    className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                                >
                                                    {type}
                                                </Button>
                                            ))
                                        }
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="videoLink"
                            render={({ field }) => (
                                <FormItem className="w-full col-span-2">
                                <FormLabel className="">Video link</FormLabel>
                                <FormControl>
                                    <Input />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full flex items-center gap-2">
                         <FormField
                            control={form.control}
                            name="brochure"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Brochure</FormLabel>
                                <FormControl>
                                    <Input placeholder="Brochure url" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <Form+ */}

                    </div>
                </div>

                 {/* Utilities */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">utilities</h2>

                    <div className="w-full grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="electricity"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Electricity</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || [ELECTRICITY[0]]}
                                    className="border bg-slate-50 capitalize rounded-md"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {ELECTRICITY.map((type, index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(type)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none lowercase"
                                        >
                                            {type}
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
                            name="waterSupply"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Water Supply</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || [WATER_SUPPLY[0]]}
                                    className="border bg-slate-50 capitalize rounded-md"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {WATER_SUPPLY.map((type, index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(type)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none lowercase"
                                        >
                                            {type}
                                        </Button>
                                        ))}
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Intricate Details */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">intricate details</h2>

                    <div className="w-full grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="yearBuilt"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Year Built</FormLabel>
                                <FormControl>
                                    <Input {...field} type='number' placeholder="eg. 2020" />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="furnished"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Furnished</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || [FURNISHED_OPTIONS[0]]}
                                    className="border bg-slate-50 capitalize rounded-md"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {FURNISHED_OPTIONS.map((type, index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(type)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none lowercase"
                                        >
                                            {type}
                                        </Button>
                                        ))}
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="floorArea"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Floor Area</FormLabel>
                                <FormControl>
                                    <Input {...field} type='number' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="landArea"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Land Area</FormLabel>
                                <FormControl>
                                    <Input {...field} type='number' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                     <div className="w-full grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="orientation"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Orientation</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="North-west" />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="propertyCondition"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Property Condition</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || [PROPERTY_CONDITIONS[0]]}
                                    className="border bg-slate-50 capitalize rounded-md"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {PROPERTY_CONDITIONS.map((type, index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(type)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none lowercase"
                                        >
                                            {type}
                                        </Button>
                                        ))}
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="floorNumber"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Floor Number</FormLabel>
                                <FormControl>
                                    <Input {...field} type='number' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalFloors"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Total Floors</FormLabel>
                                <FormControl>
                                    <Input {...field} type='number' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Amenities */}
                <div className="w-full bg-white flex flex-col gap-5 p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">amenities</h2>
                    <div className="w-full grid grid-cols-2 md:grid-cols-3">
                        {Object.entries(_generalAmenities).map(([category, amenities], index, arr) => (
                        <div
                            key={index}
                            className={cn("mb-2 pb-2", index !== (arr.length - 2) && index !== (arr.length - 1) ? "border-b border-muted" : "")}
                        >
                            <FormLabel className="text-[11px] mb-2 text-gray-700 capitalize font-semibold ml-0">
                            {amenities.label}
                            </FormLabel>

                            <div className="flex flex-col gap-2">
                            {amenities.list.map((amenity) => (
                            <FormField
                                key={amenity}
                                control={form.control}
                                name={category as keyof typeof _generalAmenities}
                                render={({ field }) => {
                                const valueArray = Array.isArray(field.value)
                                    ? field.value.filter((item): item is string => typeof item === "string")
                                    : [];

                                return (
                                    <FormItem className="flex items-center gap-2 text-gray-600 capitalize text-[11px]">
                                    <FormControl className="flex items-center gap-2 text-gray-600 capitalize text-[11px]">
                                        <Checkbox
                                        id={amenity}
                                        checked={valueArray.includes(amenity)}
                                        onCheckedChange={(checked: any) => {
                                            field.onChange(
                                            checked
                                                ? [...valueArray, amenity]
                                                : valueArray.filter((item) => item !== amenity)
                                            );
                                        }}
                                        />
                                    </FormControl>
                                    <label htmlFor={amenity}>{amenity}</label>
                                    </FormItem>
                                );
                                }}
                            />
                            ))}
                            </div>
                            <FormMessage />
                        </div>
                        ))}
                    </div>
                </div>
                
                {/* Tags & Extras */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">Tags & Extras</h2>
                    <div className="w-full">
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    
                                    placeholder="e.g. rent, apartment, 2bedroom"
                                    spellCheck={false}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                 {
                    type === 'new' ? (
                    <div className='flex items-center justify-end gap-3'>
                            <Button 
                                // onClick={handleSaveAndPreview} 
                                // loading={previewing} 
                                variant='outline' 
                                size='sm' 
                                className="border-primary text-xs"
                            > 
                                Save & Preview
                            </Button>

                            <Button loading={form.formState.isSubmitting} size='sm' className="border-primary text-xs"> 
                                Publish Property
                            </Button>
                    </div>
                    ) : (
                        <div className='flex items-center justify-end gap-3'>
                                <Button 
                                    // onClick={() => router.back()} 
                                    variant='outline' 
                                    size='sm' 
                                    className="border-primary text-xs"
                                > 
                                    Cancel
                                </Button>
        
                                <Button loading={form.formState.isSubmitting} size='sm' className="border-primary text-xs"> 
                                    Update Property
                                </Button>
                        </div>
                    )
                }
            </form>
        </Form>
    )
}