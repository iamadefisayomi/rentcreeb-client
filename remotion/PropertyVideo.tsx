import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

// Mirrors the fields relevant to the video from newPropertySchema.
// Only pass in what you need — this is intentionally a subset.
export type PropertyVideoDetails = {
  title: string;
  description?: string;
  type: string; // e.g. "duplex", "apartment"
  listedIn: string; // e.g. "sale" | "rent"
  price: number;
  paymentFrequency?: "yearly" | "quarterly" | "monthly";
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  parking: number;
  floorArea?: number;
  landArea?: number;
  furnished?: string;
  city: string;
  state: string;
  country: string;
  address: string;
  ownerName?: string;
  ownerContact?: string;
};

export type PropertyVideoProps = {
  images: string[]; // hosted URLs, in display order
  details: PropertyVideoDetails;
};

const FPS = 30;
const SECONDS_PER_IMAGE = 3.5;
export const framesPerImage = SECONDS_PER_IMAGE * FPS;

const formatPrice = (price: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);

const KenBurnsImage: React.FC<{ src: string; direction: "in" | "out" }> = ({
  src,
  direction,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale =
    direction === "in"
      ? interpolate(frame, [0, durationInFrames], [1, 1.15])
      : interpolate(frame, [0, durationInFrames], [1.15, 1]);
  const translateX = interpolate(frame, [0, durationInFrames], [0, -20]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${translateX}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{ details: PropertyVideoDetails }> = ({ details }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const translateY = spring({ frame, fps: FPS, from: 30, to: 0 });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Inter, Arial, sans-serif",
        textAlign: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ fontSize: 20, letterSpacing: 4, textTransform: "uppercase", opacity: 0.75 }}>
        {details.listedIn === "rent" ? "For Rent" : "For Sale"} · {details.type}
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, marginTop: 12 }}>{details.title}</div>
      <div style={{ fontSize: 32, marginTop: 16, opacity: 0.85 }}>
        {details.address}, {details.city}, {details.state}
      </div>
    </AbsoluteFill>
  );
};

const DetailsOverlay: React.FC<{ details: PropertyVideoDetails }> = ({ details }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const freqSuffix =
    details.listedIn === "rent" && details.paymentFrequency
      ? ` / ${details.paymentFrequency.replace("ly", "")}`
      : "";

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        padding: 60,
        fontFamily: "Inter, Arial, sans-serif",
        color: "white",
        opacity,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.55)",
          borderRadius: 16,
          padding: "24px 32px",
          display: "inline-block",
          width: "fit-content",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700 }}>
          {formatPrice(details.price)}
          {freqSuffix}
        </div>
        <div style={{ fontSize: 24, marginTop: 8, opacity: 0.9 }}>
          {details.bedrooms} bed · {details.bathrooms} bath · {details.kitchens} kitchen
          {details.parking ? ` · ${details.parking} parking` : ""}
        </div>
        {(details.floorArea || details.landArea) && (
          <div style={{ fontSize: 20, marginTop: 4, opacity: 0.75 }}>
            {details.floorArea ? `${details.floorArea} sqft floor` : ""}
            {details.floorArea && details.landArea ? " · " : ""}
            {details.landArea ? `${details.landArea} sqft land` : ""}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const OutroCard: React.FC<{ details: PropertyVideoDetails }> = ({ details }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Inter, Arial, sans-serif",
        textAlign: "center",
        opacity,
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 700 }}>{formatPrice(details.price)}</div>
      <div style={{ fontSize: 28, marginTop: 12 }}>
        {details.address}, {details.city}, {details.state}
      </div>
      {details.ownerName && (
        <div style={{ fontSize: 24, marginTop: 32, opacity: 0.8 }}>
          Contact {details.ownerName}
          {details.ownerContact ? ` · ${details.ownerContact}` : ""}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const PropertyVideo: React.FC<PropertyVideoProps> = ({ images, details }) => {
  const introFrames = 60;
  const outroFrames = 90;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence durationInFrames={introFrames}>
        <TitleCard details={details} />
      </Sequence>

      {images.map((src, i) => (
        <Sequence
          key={src + i}
          from={introFrames + i * framesPerImage}
          durationInFrames={framesPerImage}
        >
          <KenBurnsImage src={src} direction={i % 2 === 0 ? "in" : "out"} />
          <DetailsOverlay details={details} />
        </Sequence>
      ))}

      <Sequence
        from={introFrames + images.length * framesPerImage}
        durationInFrames={outroFrames}
      >
        <OutroCard details={details} />
      </Sequence>
    </AbsoluteFill>
  );
};