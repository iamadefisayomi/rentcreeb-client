"use client"

import { useEffect, useMemo, useRef, useTransition } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import isEqual from "lodash.isequal"
import {
  Form,
  FormField,
} from "@/components/ui/form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import useCookies from "@/hooks/useCookies"
import useResponsive from "@/hooks/useResponsive"
import { useDebounce } from "use-debounce";
import {
  _generalAmenities,
  CONSTRUCTION_STATUSES,
  ELECTRICITY,
  FURNISHED_OPTIONS,
  PROPERTY_CONDITIONS,
  WATER_SUPPLY,
} from "@/_data/_propertyDefault"
import { propertySearchSchema, SearchPropertySchemaType } from "./formSchemas"

// ─────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────
type NumericField = "garages" | "bedrooms" | "bathrooms" | "parkings"
type FilterFormData = yup.InferType<typeof propertySearchSchema>

// ──────────────────────────────────────────────
// MAIN FORM COMPONENT
// ──────────────────────────────────────────────
export default function HomeFilterForm({ onClose }: { onClose?: () => void }) {
  const isDesktop = useResponsive() === "desktop"
  const [savedFilters, setSavedFilters] = useCookies<SearchPropertySchemaType | any>(
    "propertySearchForm",
    {},
    24
  )

  const defaultValues = useMemo(() => ({
    listedIn: savedFilters?.listedIn || "all",
    type: savedFilters?.type || "",
    state: savedFilters?.state || "",
    lga: savedFilters?.lga || "",
    city: savedFilters?.city || "",
    min: savedFilters?.min,
    max: savedFilters?.max,
    verified: savedFilters?.verified || "all",
    amenities: savedFilters?.amenities || [],
    security: savedFilters?.security || [],
    bedrooms: savedFilters?.bedrooms,
    bathrooms: savedFilters?.bathrooms,
    garages: savedFilters?.garages,
    parkings: savedFilters?.parkings,
    location: savedFilters?.location ?? null,
  }), []);

  const form = useForm<FilterFormData>({
    resolver: yupResolver(propertySearchSchema),
    defaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    if (!isEqual(savedFilters, form.getValues())) {
      form.reset(savedFilters);
    }
  }, [savedFilters, form]);

  // submit handler
  const router = useRouter()
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

    // ✅ update cookie state so equality check works
    setSavedFilters(data);

    const queryString = new URLSearchParams(
      filteredQuery as Record<string, string>
    ).toString();

    startTransition(() => {
      router.push(`/${form.getValues("listedIn")}?${queryString}`);
    });
  }

  // watch values & auto-submit (debounced)
  const values = form.watch();
  const [debouncedValues] = useDebounce(values, 500);

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!isEqual(debouncedValues, savedFilters)) {
      onSubmit(debouncedValues);
    }
  }, [debouncedValues, savedFilters]);

  return (
    <Form {...form}>
      <div className="text-white flex flex-col w-full border-b border-b-muted-foreground">
        {/* Header */}
        <div className="w-full flex items-center bg-slate-900 justify-between gap-2 p-4 border-b border-muted-foreground">
          <h2 className="text-xs font-medium uppercase">filter-components</h2>
          {!isDesktop ? (
            <Button
              onClick={onClose}
              variant="outline"
              className="group/closeButton border-muted-foreground border rounded-xl bg-slate-800 flex items-center gap-2"
            >
              Close
              <X className="w-4 text-muted group-hover/closeButton:text-gray-800" />
            </Button>
          ) : isPending ? <Loader2 className="w-4 animate-spin duration-1000 text-muted" /> : null }
        </div>

        {/* Filter Accordions */}
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["verified-agents", "garages", "bedrooms", "bathrooms", "parkings", "furnished", "propertyCondition", "waterSupply", "constructionStatus", "electricity"]}
        >
          {/* Numeric Toggles */}
          {(["bedrooms", "parkings", "bathrooms", "garages"] as NumericField[]).map((type) => (
            <FormField
              control={form.control}
              key={type}
              name={type}
              render={({ field }) => (
                <AccordionItem value={type} className="bg-slate-900 px-4 mb-0 border-b border-b-muted-foreground">
                  <AccordionTrigger className="text-xs capitalize font-medium mb-0">
                    {type}
                  </AccordionTrigger>
                  <AccordionContent className="font-normal text-[11px]">
                    <ToggleGroup
                      value={field.value ? String(field.value) : "any"}
                      onValueChange={field.onChange}
                      type="single"
                      variant="outline"
                      className="w-full flex items-center justify-between"
                    >
                      {Array.from({ length: 6 }).map((_, index) => (
                        <ToggleGroupItem
                          className="border-muted-foreground"
                          size="sm"
                          value={index === 0 ? "any" : String(index)}
                          key={index}
                        >
                          <p className="text-xs capitalize">{index === 0 ? "any" : `${index}+`}</p>
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </AccordionContent>
                </AccordionItem>
              )}
            />
          ))}

          {/* Single-choice filters */}
          <RadioGroupField control={form.control} name="furnished" label="Furnishing" options={FURNISHED_OPTIONS} />
          <RadioGroupField control={form.control} name="propertyCondition" label="Property Condition" options={PROPERTY_CONDITIONS} />
          <RadioGroupField control={form.control} name="constructionStatus" label="Construction Status" options={CONSTRUCTION_STATUSES} />
          <RadioGroupField control={form.control} name="waterSupply" label="Water Supply" options={WATER_SUPPLY} />
          <RadioGroupField control={form.control} name="electricity" label="Electricity" options={ELECTRICITY} />

          {/* Multi-select amenities */}
          <MultiSelectField control={form.control} name="amenities" label="Amenities" options={Object.values(_generalAmenities).flatMap((g) => g.list)} />

          {/* Verified */}
          <FormField
            control={form.control}
            name="verified"
            render={({ field }) => (
              <AccordionItem value="verified-agents" className="bg-slate-900 px-4">
                <AccordionTrigger className="text-xs capitalize font-medium">
                  verified agents
                </AccordionTrigger>
                <AccordionContent className="font-normal text-[11px]">
                  <RadioGroup onValueChange={field.onChange} value={field.value || "all"}>
                    {["all", "verified", "unverified"].map((v) => (
                      <div key={v} className="flex items-center gap-3">
                        <RadioGroupItem value={v} id={v} />
                        <Label htmlFor={v}>{v}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            )}
          />
        </Accordion>
      </div>
    </Form>
  )
}

// ──────────────────────────────────────────────
// REUSABLE FIELDS
// ──────────────────────────────────────────────
type MultiSelectFieldProps = {
  control: any
  name: string
  label: string
  options: readonly string[]
}
function MultiSelectField({ control, name, label, options }: MultiSelectFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = Array.isArray(field.value) ? field.value : []
        return (
          <div className="w-full border-b border-b-muted-foreground">
            <AccordionItem value={name} className="bg-slate-900 px-4">
              <AccordionTrigger className="text-xs capitalize font-medium">{label}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 text-[11px] font-normal">
                {options.map((option) => {
                  const checked = value.includes(option)
                  return (
                    <div key={option} className="flex items-center gap-2">
                      <Checkbox
                        id={`${name}-${option}`}
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          if (isChecked) {
                            field.onChange([...value, option])
                          } else {
                            field.onChange(value.filter((o) => o !== option))
                          }
                        }}
                      />
                      <Label htmlFor={`${name}-${option}`} className="text-xs capitalize">
                        {option}
                      </Label>
                    </div>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          </div>
        )
      }}
    />
  )
}

interface RadioGroupFieldProps {
  control: any
  name: string
  label: string
  options: string[]
}
export function RadioGroupField({ control, name, label, options }: RadioGroupFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="w-full border-b border-b-muted-foreground">
          <AccordionItem value={name} className="bg-slate-900 px-4 ">
            <AccordionTrigger className="text-xs capitalize font-medium">{label}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 text-[11px] font-normal">
              <RadioGroup value={field.value || ""} onValueChange={field.onChange} className="flex flex-col gap-2">
                {options.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <RadioGroupItem value={option} id={`${name}-${option}`} />
                    <Label htmlFor={`${name}-${option}`} className="text-xs capitalize">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </div>
      )}
    />
  )
}