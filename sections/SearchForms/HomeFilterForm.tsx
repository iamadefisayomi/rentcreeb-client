"use client"

import { useEffect, useMemo, useRef, useTransition } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Loader2, X } from "lucide-react"

import {
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormField } from "@/components/ui/form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input"

import { useDebounce } from "use-debounce"
import useResponsive from "@/hooks/useResponsive"

import {
  _generalAmenities,
  CONSTRUCTION_STATUSES,
  ELECTRICITY,
  FURNISHED_OPTIONS,
  PROPERTY_CONDITIONS,
  WATER_SUPPLY
} from "@/_data/_propertyDefault"

import {
  propertySearchSchema,
  SearchPropertySchemaType
} from "./formSchemas"

type NumericField = "garages" | "bedrooms" | "bathrooms" | "parkings"
type FilterFormData = yup.InferType<typeof propertySearchSchema>

function parseUrlParams(params: URLSearchParams) {
  const obj: any = {}

  params.forEach((value, key) => {
    if (value.includes(",")) obj[key] = value.split(",")
    else if (!isNaN(Number(value))) obj[key] = Number(value)
    else obj[key] = value
  })

  return obj
}

function buildQuery(values: any) {
  const params = new URLSearchParams()

  Object.entries(values).forEach(([key, value]) => {
    if (value === "" || value === undefined || value === null) return

    if (Array.isArray(value)) {
      if (value.length === 0) return
      params.set(key, value.join(","))
    } else {
      params.set(key, String(value))
    }
  })

  return params.toString()
}

export default function HomeFilterForm({ onClose }: { onClose?: () => void }) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isDesktop = useResponsive() === "desktop"
  const [isPending, startTransition] = useTransition()

  const urlFilters = useMemo(
    () => parseUrlParams(searchParams),
    [searchParams]
  )

  const form = useForm<FilterFormData>({
    resolver: yupResolver(propertySearchSchema),
    defaultValues: urlFilters,
    mode: "onChange"
  })

 const lastUrlRef = useRef("")

  useEffect(() => {

    const urlQuery = searchParams.toString()

    if (urlQuery === lastUrlRef.current) return

    lastUrlRef.current = urlQuery

    form.reset(urlFilters)

  }, [urlFilters, searchParams, form])

  const values = form.watch()
  const [debouncedValues] = useDebounce(values, 400)

  const firstRender = useRef(true)

  const lastQueryRef = useRef<string>("")
  useEffect(() => {

    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const query = buildQuery(debouncedValues)

    if (query === lastQueryRef.current) return

    lastQueryRef.current = query

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    })

  }, [debouncedValues, pathname, router])

  return (
    <Form {...form}>
      <div className="text-white flex flex-col w-full border-b border-b-muted-foreground">

        <div className="w-full flex items-center bg-slate-900 justify-between gap-2 p-4 h-14 border-b border-muted-foreground">
          <h2 className="text-xs font-medium uppercase">
            filter-components
          </h2>

          {!isDesktop ? (
            <Button
              onClick={onClose}
              variant="outline"
              className="border-muted-foreground border rounded-xl bg-slate-800 flex items-center gap-2"
            >
              Close
              <X className="w-4 text-muted" />
            </Button>
          ) : isPending ? (
            <Loader2 className="w-4 animate-spin text-muted" />
          ) : null}
        </div>

        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={[
            "verified-agents",
            "garages",
            "bedrooms",
            "bathrooms",
            "parkings"
          ]}
        >

          {(["bedrooms","parkings","bathrooms","garages"] as NumericField[]).map((type) => (
            <FormField
              key={type}
              control={form.control}
              name={type}
              render={({ field }) => (
                <AccordionItem value={type} className="bg-slate-900 px-4 border-b border-muted-foreground">

                  <AccordionTrigger className="text-xs capitalize font-medium">
                    {type}
                  </AccordionTrigger>

                  <AccordionContent>

                    <ToggleGroup
                      type="single"
                      value={field.value ? String(field.value) : "any"}
                      onValueChange={field.onChange}
                      className="w-full flex justify-between "
                    >
                      {Array.from({ length: 6 }).map((_, i) => (
                        <ToggleGroupItem
                          key={i}
                          value={i === 0 ? "any" : String(i)}
                          className="text-xs"
                        >
                          {i === 0 ? "any" : `${i}+`}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>

                  </AccordionContent>

                </AccordionItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <AccordionItem value="size" className="bg-slate-900 px-4">

                <AccordionTrigger className="text-xs font-medium">
                  Property Size
                </AccordionTrigger>

                <AccordionContent>
                  <Input
                    type="number"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Enter size (sqm)"
                    className="bg-slate-800"
                  />
                </AccordionContent>

              </AccordionItem>
            )}
          />

          <MultiSelectField
            control={form.control}
            name="amenities"
            label="Amenities"
            options={Object.values(_generalAmenities).flatMap((g) => g.list)}
          />

          <RadioGroupField
            control={form.control}
            name="furnished"
            label="Furnishing"
            options={FURNISHED_OPTIONS}
          />

          <RadioGroupField
            control={form.control}
            name="propertyCondition"
            label="Property Condition"
            options={PROPERTY_CONDITIONS}
          />

          <RadioGroupField
            control={form.control}
            name="constructionStatus"
            label="Construction Status"
            options={CONSTRUCTION_STATUSES}
          />

          <RadioGroupField
            control={form.control}
            name="waterSupply"
            label="Water Supply"
            options={WATER_SUPPLY}
          />

          <RadioGroupField
            control={form.control}
            name="electricity"
            label="Electricity"
            options={ELECTRICITY}
          />

        </Accordion>
      </div>
    </Form>
  )
}

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

              <AccordionTrigger className="text-xs font-medium">
                {label}
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-2 text-[11px]">

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
                            field.onChange(
                              value.filter((v) => v !== option)
                            )
                          }

                        }}
                      />

                      <Label htmlFor={`${name}-${option}`}>
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

function RadioGroupField({ control, name, label, options }: any) {

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (

        <div className="w-full border-b border-b-muted-foreground">

          <AccordionItem value={name} className="bg-slate-900 px-4">

            <AccordionTrigger className="text-xs font-medium">
              {label}
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-2 text-[11px]">

              <RadioGroup
                value={field.value || ""}
                onValueChange={field.onChange}
                className="flex flex-col gap-2"
              >

                {options.map((option: string) => (
                  <div key={option} className="flex items-center gap-2">

                    <RadioGroupItem
                      value={option}
                      id={`${name}-${option}`}
                    />

                    <Label htmlFor={`${name}-${option}`}>
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