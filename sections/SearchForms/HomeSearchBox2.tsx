"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import DropDownComp from "@/components/DropdownComp";
import MobileFilter from "./mobileFilter";
import AddressAutocomplete from "../Autocomplete/AddressAutocomplete";
import useResponsive from "@/hooks/useResponsive";
import { propertySearchSchema, SearchPropertySchemaType } from "./formSchemas";
import { _listedIn, _propertyTypes } from "@/_data/_propertyDefault";
import { generatePriceList } from "./generatePriceList";

// Parse URLSearchParams into usable form values
function parseSearchParams(params: URLSearchParams): Partial<SearchPropertySchemaType> {
  const values: Partial<SearchPropertySchemaType> = {};

  params.forEach((value, key) => {
    if (["min","max","bedrooms","bathrooms","garages","parkings"].includes(key)) {
      values[key as keyof SearchPropertySchemaType] = Number(value) as any;
    } else {
      values[key as keyof SearchPropertySchemaType] = value as any;
    }
  });

  return values;
}

// Build query string from form data
function buildQuery(data: SearchPropertySchemaType) {
  // Exclude empty fields, but include state/lga/city
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => {
      if (Array.isArray(v)) return v.length > 0;
      return v !== "" && v !== null && v !== undefined;
    })
  );
  return new URLSearchParams(filtered as Record<string,string>).toString();
}

export function HomeSearchBox2 () {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useResponsive() === "desktop";
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

    const currentMode = useMemo(() => {
      if (!pathname) return _listedIn.rent;

      const segments = pathname.split("/").filter(Boolean);

      return segments[0] || _listedIn.rent;
    }, [pathname]);

  // Memoize URL values
  const urlValues = useMemo(() => parseSearchParams(searchParams), [searchParams]);



  // Form
  const form = useForm<SearchPropertySchemaType>({
    resolver: yupResolver(propertySearchSchema),
    defaultValues: {
      listedIn: currentMode || urlValues.listedIn || _listedIn.rent,
      type: "",
      state: "",
      lga: "",
      city: "",
      min: undefined,
      max: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      garages: undefined,
      parkings: undefined,
      ...urlValues,
    }
  });

    useEffect(() => {
  if (!currentMode) return;

  form.setValue("listedIn", currentMode as any);
}, [currentMode, form]);

  // Prevent unnecessary resets
  const lastQueryRef = useRef("");
  useEffect(() => {
    const currentQuery = searchParams.toString();
    if (currentQuery === lastQueryRef.current) return;
    lastQueryRef.current = currentQuery;

    form.reset({
      listedIn: currentMode || urlValues.listedIn || _listedIn.rent,
      type: urlValues.type || "",
      state: urlValues.state || "",
      lga: urlValues.lga || "",
      city: urlValues.city || "",
      min: urlValues.min,
      max: urlValues.max,
      bedrooms: urlValues.bedrooms,
      bathrooms: urlValues.bathrooms,
      garages: urlValues.garages,
      parkings: urlValues.parkings
    });
  }, [searchParams, urlValues, form]);

  const priceList = useMemo(() => generatePriceList(), []);

  // Location state
  const [location, setLocation] = useState<any>({});
  useEffect(() => {
    form.setValue("state", location.state || "");
    form.setValue("lga", location.lga || "");
    form.setValue("city", location.ward || "");
  }, [location, form]);

  // Submit handler
  function onSubmit(data: SearchPropertySchemaType) {
    const propertyUrl = [
      data.listedIn,
      data.type,
      data.state,
      // data.lga,
      // data.city
    ].filter(Boolean).join("/").toLowerCase();

    const query = buildQuery(data);

    startTransition(() => {
      router.push(`/${propertyUrl}?${query}`);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3 p-2 bg-white rounded-2xl max-w-5xl"
      >

        {/* Listed In Toggle */}
        <FormField
          control={form.control}
          name="listedIn"
          render={({ field }) => (
            <FormItem className="flex items-center justify-center w-full border-b border-muted pb-3">
              <FormControl>
                <ToggleGroup
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  type="single"
                  className="grid grid-cols-3 w-full max-w-md"
                >
                  {Object.entries(_listedIn).map(([key,value]) => (
                    <ToggleGroupItem
                      key={value}
                      value={value}
                      className="hover:bg-primary text-gray-700 hover:text-white"
                    >
                      <h3 className="text-sm capitalize font-semibold">{key}</h3>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="w-full flex flex-col p-4 gap-4">

          {/* Property Type */}
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
                      <div className="flex flex-col gap-1 items-start w-full">
                        {Object.entries(_propertyTypes).map(([key,value]) => (
                          <Button
                            key={value}
                            size="sm"
                            variant="ghost"
                            onClick={() => field.onChange(value)}
                            className="text-xs w-full flex justify-start lowercase rounded-none"
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

          {/* Address Autocomplete */}
          <div className="w-full col-span-3">
            <AddressAutocomplete setLocation={setLocation} />
          </div>

          {/* Price Fields */}
            <FormField
              control={form.control}
              name="min"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <DropDownComp
                      title={priceList.find(p => p.value === Number(field.value))?.label || "min Price"}
                      className="lowercase"
                      component={
                        <div className="flex flex-col gap-2 w-full">
                          {priceList.map((price) => (
                            <Button
                              key={price.value}
                              type="button"
                              variant="ghost"
                              onClick={() => field.onChange(price.value)}
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

            <FormField
              control={form.control}
              name="max"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <DropDownComp
                      title={priceList.find(p => p.value === Number(field.value))?.label || "max Price"}
                      className="lowercase"
                      component={
                        <div className="flex flex-col gap-2 w-full">
                          {priceList.map((price) => (
                            <Button
                              key={price.value}
                              type="button"
                              variant="ghost"
                              onClick={() => field.onChange(price.value)}
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

            {/* Desktop Search Button */}
            <Button type="submit" loading={isPending} className="px-4 hidden md:flex h-10">
              Search
            </Button>

          {/* Mobile CTA */}
          {!isDesktop && (
            <div className="md:hidden flex items-center w-full gap-2">
              <Button type="submit" loading={isPending} className="w-full h-10">
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