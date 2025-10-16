import { getUserFavourites } from "@/actions/favourites";
import PropertyLayout from "../singleProperty/propertyLayout";
import { PropertyDocument } from "@/server/schema/Property";




export default async function FeaturedProperty ({ property }: { property: PropertyDocument}) {
    const favs = await (await getUserFavourites()).data
    return (
        <div className="w-full mx-auto flex items-start py-12 justify-center min-h-[70vh] px-4 bg-slate-200/20">
            <div className="w-full max-w-7xl flex flex-col gap-10">
                <div className="w-full flex flex-col items-center gap-1">
                    <p className="text-xs font-medium uppercase text-primary">explore properties</p>
                    <h2 className='text-3xl text-slate-800 font-semibold text-center capitalize'>featured properties</h2>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                    {
                        Array.from({length: 4}).map((_, index) => (
                            <PropertyLayout favourites={favs} property={property} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}