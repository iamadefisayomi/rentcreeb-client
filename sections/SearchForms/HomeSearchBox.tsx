"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  propertySearchSchema,
  SearchPropertySchemaType,
} from "./formSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import useResponsive from "@/hooks/useResponsive";
import MobileFilter from "./mobileFilter";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import DropDownComp from "@/components/DropdownComp";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { generatePriceList } from "./generatePriceList";
import { _listedIn, _propertyTypes } from "@/_data/_propertyDefault";
import useCookies from "@/hooks/useCookies";
import AddressAutocomplete from "../Autocomplete/AddressAutocomplete";

export function HomeSearchBox() {
  const isDesktop = useResponsive() === "desktop";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Cookie for form state
  const [savedFormValues, setSavedFormValues] =useCookies<SearchPropertySchemaType | any>("propertySearchForm", {}, 24);

  // Sync query params into cookies on first load
  useEffect(() => {
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });

    if (Object.keys(paramsObj).length > 0) {
      setSavedFormValues(paramsObj as unknown as SearchPropertySchemaType);
    }
  }, [pathname, searchParams]);

  const form = useForm<SearchPropertySchemaType>({
  resolver: yupResolver(propertySearchSchema),
  defaultValues: {
    listedIn: savedFormValues?.listedIn || _listedIn.rent,
    type: savedFormValues?.type || "",
    state: savedFormValues?.state || "",
    lga: savedFormValues?.lga || "",
    city: savedFormValues?.city || "",
    min: savedFormValues?.min,
    max: savedFormValues?.max,
    amenities: savedFormValues?.amenities || [],
    security: savedFormValues?.security || [],
    bedrooms: savedFormValues?.bedrooms,
    bathrooms: savedFormValues?.bathrooms,
    garages: savedFormValues?.garages,
    parkings: savedFormValues?.parkings,
    location: savedFormValues?.location ?? null,
  },
});

  // Autocomplete cookie
  const [location, setLocation] = useCookies<any>("autocompleteLocation","",24);

  // Sync autocomplete into form
  useEffect(() => {
  if (location) {
    if (location.state) {
      form.setValue("state", location.state);
    } else {
      form.resetField("state");
    }

    if (location.lga) {
      form.setValue("lga", location.lga);
    } else {
      form.resetField("lga");
    }

    if (location.ward) {
      form.setValue("city", location.ward);
    } else {
      form.resetField("city");
    }

    if (location.coordinates?.length === 2) {
      form.setValue("location", {
        type: "Point",
        coordinates: location.coordinates,
      });
    } else {
      form.setValue("location", null);
    }
  } else {
    form.resetField("state");
    form.resetField("lga");
    form.resetField("city");
    form.setValue("location", null);
  }
}, [location, form]);


  const _priceList = generatePriceList();

  // Persist values to cookies
  useEffect(() => {
    const subscription = form.watch((values) => {
      setSavedFormValues((prev: any) => ({
        // ...prev,
        ...values,
        location: values.location && values.location.coordinates?.length === 2
          ? {
              type: "Point",
              coordinates: values.location.coordinates,
            }
          : null,
      }));
    });

  return () => subscription.unsubscribe();
}, [form, setSavedFormValues]);

  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: SearchPropertySchemaType) {
    const filteredQuery = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => {
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "object" && v?.coordinates)
          return v.coordinates.length === 2;
        return v !== "" && v !== null && v !== undefined;
      })
    );

    const queryString = new URLSearchParams(
      filteredQuery as Record<string, string>
    ).toString();

    startTransition(() => {
      router.push(`/${form.getValues("listedIn")}?${queryString}`);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3 md:p-6 p-4 bg-slate-900 rounded-2xl max-w-5xl"
      >
        {/* Listed In */}
        <FormField
          control={form.control}
          name="listedIn"
          render={({ field }) => (
            <FormItem className="flex items-center justify-center w-full border-b border-muted-foreground text-background pb-3">
              <FormControl>
                <ToggleGroup
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  type="single"
                  className="grid grid-cols-3 w-full max-w-md"
                >
                  {Object.entries(_listedIn).map(([key, value], index) => (
                    <ToggleGroupItem key={index} value={value} aria-label={key}>
                      <h3 className="text-sm capitalize font-semibold ">
                        {key}
                      </h3>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Property Type */}
        <div className="w-full md:grid flex flex-col md:grid-cols-7 gap-4 md:gap-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <DropDownComp
                    title={field.value || "all"}
                    className="lowercase"
                    component={
                      <div className="flex w-full flex-col gap-1 items-start">
                        {Object.entries(_propertyTypes).map(([key, value], index) => (
                          <Button
                            size="sm"
                            onClick={() => field.onChange(value)}
                            variant="ghost"
                            key={index}
                            className="text-xs w-full flex justify-start items-center rounded-none lowercase"
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

          {/* Address */}
          <div className="w-full col-span-3">
            <AddressAutocomplete setLocation={setLocation} />
          </div>

          {/* Price Min & Max */}
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 col-span-3">
            <FormField
              control={form.control}
              name="min"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <DropDownComp
                      className="lowercase"
                      title={
                        _priceList.find((p) => p.value === Number(field.value))
                          ?.label || "min Price"
                      }
                      component={
                        <div className="flex w-full flex-col gap-2 items-start">
                          {_priceList.map((price, index) => (
                            <Button
                              onClick={() => field.onChange(price.value)}
                              variant="ghost"
                              key={index}
                              className="text-xs lowercase w-full"
                            >
                              {price.label}
                            </Button>
                          ))}
                        </div>
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* <p className="text-background">-</p> */}

            <FormField
              control={form.control}
              name="max"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <DropDownComp
                      className="lowercase"
                      title={
                        _priceList.find((p) => p.value === Number(field.value))
                          ?.label || "max Price"
                      }
                      component={
                        <div className="flex w-full flex-col gap-2 items-start">
                          {_priceList.map((price, index) => (
                            <Button
                              onClick={() => field.onChange(price.value)}
                              variant="ghost"
                              key={index}
                              className="text-xs lowercase w-full"
                            >
                              {price.label}
                            </Button>
                          ))}
                        </div>
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              loading={isPending}
              className="px-4 hidden md:flex h-10"
            >
              Search
            </Button>
          </div>

          {/* Mobile CTA */}
          {!isDesktop && (
            <div className="md:hidden flex items-center w-full gap-2">
              <Button loading={isPending} className="w-full h-10">
                Search
              </Button>
              <MobileFilter />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
