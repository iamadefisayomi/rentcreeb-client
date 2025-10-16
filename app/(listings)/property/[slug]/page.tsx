import PropertyDetails from "./PropertyDetails";
import { getPropertyById } from "@/actions/properties";
import { getReviews } from "@/actions/reviews";
import { PropertyDocument } from "@/server/schema/Property";
import { ReviewDocument } from "@/server/schema/Review";

type Props = {
  params: Promise<{ slug: string }>;
};

// Fetch property once and reuse
async function fetchProperty(id: string): Promise<PropertyDocument | any> {
  try {
    const response = await getPropertyById(id);
    return response?.data as PropertyDocument;
  } catch {
    return null;
  }
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
