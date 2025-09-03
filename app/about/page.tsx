
import { _properties } from "@/_data/images";
import GlobalProperties from "@/sections/about-us/GlobalProperties";
import SignatureFeature from "@/sections/about-us/SignatureFeature";
import ExploreGallery from "@/sections/home/ExploreGallery";
import TestimonialSlider from "@/sections/home/TestimonialSlider";
import Team from "@/sections/about-us/Team";



export default function About () {

    return (
        <div className="w-full flex flex-col">
            <GlobalProperties />
            <SignatureFeature />
            <ExploreGallery />
            <TestimonialSlider />
            <Team />
        </div>
    )
}