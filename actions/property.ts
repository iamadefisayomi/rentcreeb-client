import { dbConnection } from "@/lib/dbConnection";
import { SearchPropertySchemaType } from "@/sections/SearchForms/formSchemas";
import Property from "@/server/schema/Property";

export async function getProperties({filters={} as SearchPropertySchemaType, limit = 20}: {filters?: SearchPropertySchemaType, limit?: number}) {

  await dbConnection()
  const query: any = {};

  // ✅ Type filter
  if (filters.type) {
    query.type = filters.type;
  }

  // ✅ ListedIn filter
  if (filters.listedIn) {
    query.listedIn = filters.listedIn;
  }

  // ✅ Location filters
  if (filters.state) query.state = filters.state;
  if (filters.lga) query.lga = filters.lga;
  if (filters.city) query.city = filters.city;

  // ✅ Price range
  if (filters.min || filters.max) {
    query.price = {};
    if (filters.min) query.price.$gte = filters.min;
    if (filters.max) query.price.$lte = filters.max;
  }

  // ✅ Amenities & Security (all must match)
  if (filters.amenities?.length) {
    query.amenities = { $all: filters.amenities };
  }
  if (filters.security?.length) {
    query.security = { $all: filters.security };
  }

  // ✅ Numeric features
  if (filters.bedrooms) query.bedrooms = { $gte: filters.bedrooms };
  if (filters.bathrooms) query.bathrooms = { $gte: filters.bathrooms };
  if (filters.garages) query.garages = { $gte: filters.garages };
  if (filters.parkings) query.parkings = { $gte: filters.parkings };

  // ✅ Location-based query (GeoSpatial)
  if (filters.location?.coordinates?.length === 2) {
    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: filters.location.coordinates,
        },
        $maxDistance: 5000, // 5km radius (adjustable)
      },
    };
  }

  let properties;

  // ✅ If no filters provided → random properties
  if (Object.keys(query).length === 0) {
    properties = await Property.aggregate([{ $sample: { size: limit } }]);
  } else {
    properties = await Property.find(query).limit(limit).lean();
  }

  // ✅ Recommended properties
  let recommended: any[] = [];
  if (properties.length > 0) {
    const base = properties[0];

    const recQuery: any = {
      _id: { $ne: base._id },
      $or: [
        { type: base.type },
        { state: base.state },
        { city: base.city },
        { amenities: { $in: base.amenities || [] } },
      ],
    };

    recommended = await Property.find(recQuery).limit(10).lean();

    // 🔁 Fallback: If no recommended, fill with random
    if (!recommended.length) {
      recommended = await Property.aggregate([
        { $match: { _id: { $ne: base._id } } },
        { $sample: { size: 10 } },
      ]);
    }
  }

  // ✅ Similar properties (geo + type + price range)
  let similarProperties: any[] = [];
  if (properties.length > 0 && properties[0].location?.coordinates) {
    const base = properties[0];

    const simQuery: any = {
      _id: { $ne: base._id },
      type: base.type,
      price: {
        $gte: base.price * 0.8,
        $lte: base.price * 1.2,
      },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: base.location.coordinates,
          },
          $maxDistance: 8000, // 8km radius
        },
      },
    };

    similarProperties = await Property.find(simQuery).limit(10).lean();

    // 🔁 Fallback: If no similar, fill with random
    if (!similarProperties.length) {
      similarProperties = await Property.aggregate([
        { $match: { _id: { $ne: base._id } } },
        { $sample: { size: 10 } },
      ]);
    }
  }

  return { properties, recommended, similarProperties };
}
