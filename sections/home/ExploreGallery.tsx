import { getRandomPropertyImages } from "@/actions/properties";
import RandomImagesGallery from "./RandomImagesGallery";



export default async function ExploreGallery () {
    const images = await (await getRandomPropertyImages()).data
    return <RandomImagesGallery images={images} />
}