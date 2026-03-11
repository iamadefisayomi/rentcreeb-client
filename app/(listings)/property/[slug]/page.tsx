import PropertyDetails from "./PropertyDetails";
import { getPropertyById } from "@/actions/properties";
import { getReviews } from "@/actions/reviews";
import { PropertyDocument } from "@/server/schema/Property";
import { ReviewDocument } from "@/server/schema/Review";
import { notFound } from "next/navigation";

export const maxDuration = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

// Fetch property once and reuse
async function fetchProperty(id: string): Promise<PropertyDocument> {
  const response = await getPropertyById(id);

  if (!response?.success || !response.data) {
    notFound(); 
  }

  return response.data as PropertyDocument;
}

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const property = await fetchProperty(slug);

    return {
      title: `${property?.slug || "Property Details"} - ${property?.listedIn || ""}`,
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return { title: "Property Details" };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const property = await fetchProperty(slug) as PropertyDocument
  const reviews = (property?._id ? (await getReviews(property._id as any)).data : []) as ReviewDocument[]

  return <PropertyDetails property={property! as PropertyDocument} reviews={reviews} />;
}
