import { NewPropertySchemaType } from "@/sections/dashboard/formSchemas";
import PropertyDetails from "./PropertyDetails";
import { getPropertyById, findSimilarProperties } from "@/actions/properties";

type Props = {
  params: Promise<{ id: string }>;
};

// Fetch property once and reuse
async function fetchProperty(id: string): Promise<NewPropertySchemaType | any> {
  try {
    const response = await getPropertyById(id);
    return response?.data as NewPropertySchemaType;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const property = await fetchProperty(id);

  return {
    title:`${property?.slug} | Rent-House® - Your Trusted Home Rental Partner` || "Property Details",
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const property = await fetchProperty(id);

  return <PropertyDetails property={property! as NewPropertySchemaType} />;
}
