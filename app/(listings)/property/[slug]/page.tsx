import { NewPropertySchemaType } from "@/sections/dashboard/formSchemas";
import PropertyDetails from "./PropertyDetails";
import { getPropertyById } from "@/actions/properties";

type Props = {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const property = await fetchProperty(slug);

  return {
    title:`${property?.slug} - Listings | Rent-House® - Your Trusted Home Rental Partner` || "Property Details",
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const property = await fetchProperty(slug);

  return <PropertyDetails property={property! as NewPropertySchemaType} />;
}
