import { Composition } from "remotion";
import { PropertyVideo, framesPerImage } from "./PropertyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PropertyVideo"
      component={PropertyVideo}
      fps={30}
      width={1920}
      height={1080}
      durationInFrames={60 + 5 * framesPerImage + 90}
      defaultProps={{
        images: [] as string[],
        details: {
          title: "Beautiful Property",
          type: "duplex",
          listedIn: "sale",
          address: "",
          city: "",
          state: "",
          country: "",
          price: 0,
          bedrooms: 0,
          bathrooms: 0,
          kitchens: 0,
          parking: 0,
        },
      }}
      calculateMetadata={async ({ props }) => {
        const introFrames = 60;
        const outroFrames = 90;
        const imageCount = props.images.length || 1;
        return {
          durationInFrames: introFrames + imageCount * framesPerImage + outroFrames,
        };
      }}
    />
  );
};