import { PropertyDocument } from "@/server/schema/Property";
import SingleProperty from "../singleProperty";




export default function SimilarProperty ({ similarProperties, city, state, lga, type }: { similarProperties: PropertyDocument[], state?: any, city?: any, lga?: any, type?: any}) {

    const place = city ?? lga ?? type ?? "your search";

    const inStatePart = state ? ` in ${state} State` : "";
  
    return (
        <div className="w-full mx-auto flex items-start pt-2 pb-12 justify-center min-h-[70vh] px-2 col-span-full">
            <div className="w-full max-w-7xl flex flex-col gap-10">
                <div className="w-full flex flex-col items-start gap-1 p-2 bg-primary rounded-xl">
                    <h2 className='text-sm text-white  font-medium '>
                        {`That may be all for ${place}${inStatePart} at this time. Would you like to see similar ones?`}
                    </h2>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    {
                        similarProperties && similarProperties.length > 0 &&
                        similarProperties.map((property, index) => (
                            <SingleProperty key={index} property={property} isGrid={false} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}