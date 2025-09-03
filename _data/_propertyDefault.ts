export const _propertyStatus: Record<string, string> = {
  Available: "#bfdbfe",       // red-200
  Pending: "#fde68a",         // amber-200
  Sold: "#bbf7d0",            // green-200
  Rented: "#bbf7d0",          // green-200
  "Under Review": "#fef08a",  // yellow-200
  Inactive: "#e5e7eb",        // gray-200
  Withdrawn: "#fecaca",       // red-200
  "Coming Soon": "#c7d2fe",   // indigo-200
  Expired: "#cbd5e1",         // slate-200
};

export const FURNISHED_OPTIONS = ['furnished', 'semi-furnished', 'unfurnished']
export const PROPERTY_CONDITIONS = ['new', 'good', 'needs renovation', 'under renovation']
export const CONSTRUCTION_STATUSES = ['off-plan', 'under construction', 'ready to move']
export const WATER_SUPPLY = ['public', 'borehole', 'none']
export const ELECTRICITY = ['public', 'generator', 'solar']

export type FurnishedOption = typeof FURNISHED_OPTIONS[number];
export type PropertyCondition = typeof PROPERTY_CONDITIONS[number];
export type ConstructionStatus = typeof CONSTRUCTION_STATUSES[number];
export type WaterSupply = typeof WATER_SUPPLY[number];
export type Electricity = typeof ELECTRICITY[number];


export const FIELD_NAMES = ["bedrooms", "bathrooms", "kitchens", "parking"] as const;

export const _listedIn ={
  rent: 'for-rent',
  buy: 'for-sale',
  "short let": 'short-let'
}

export const _propertyTypes = {
  all: "",
  apartment: "Apartment",
  house: "House",
  hall: "hall",
  "event center": "event center",
  condo: "Condo",
  townhouse: "Townhouse",
  villa: "Villa",
  duplex: "Duplex",
  penthouse: "Penthouse",
  studio: "Studio",
  cottage: "Cottage",
  bungalow: "Bungalow",
  loft: "Loft",
  cabin: "Cabin",
  mansion: "Mansion",
  farmhouse: "Farmhouse",
  chalet: "Chalet",
};

export const _myPropertySort = {
  newest: {
    label: "Newest",
    value: "newest",
    sort: { createdAt: -1 }, // latest first
  },
  oldest: {
    label: "Oldest",
    value: "oldest",
    sort: { createdAt: 1 }, // oldest first
  },
  bestSeller: {
    label: "Best Seller",
    value: "bestSeller",
    sort: { salesCount: -1 }, // needs a salesCount field
  },
  priceLow: {
    label: "Price: Low to High",
    value: "priceLow",
    sort: { price: 1 },
  },
  priceHigh: {
    label: "Price: High to Low",
    value: "priceHigh",
    sort: { price: -1 },
  },
  mostViewed: {
    label: "Most Viewed",
    value: "mostViewed",
    sort: { views: -1 },
  },
  topRated: {
    label: "Top Rated",
    value: "topRated",
    sort: { averageRating: -1 }, // needs ratings field
  },
};


export const _generalAmenities = {
  general: {
    label: 'General Amenities',
    list: [
      "Air Conditioning",
      "Wi-Fi",
      "Parking",
      "Swimming Pool",
      "Refrigerator",
      "Laundry Facilities",
      "Cable TV",
      "Barbecue Area",
      "Fireplace",
      "Microwave",
      "Washer/Dryer",
      "Storage Room"
    ]
  },
  indoor: {
    label: 'Indoor Features',
    list: [
      "Ensuite Bathroom",
      "Home Office / Study",
      "Media Room",
      "Built-in Wardrobes",
      "Dishwasher",
      "Alarm System",
      "Hardwood Floors",
      "Gym",
      "High-Speed Internet",
      "Projector / Home Theater",
      "Elevator",
      "High Ceilings",
      "Walk-in Closet"
    ]
  },
  outdoor: {
    label: 'Outdoor Features',
    list: [
      "Balcony",
      "Backyard",
      "Front Yard",
      "Garden",
      "Patio / Outdoor Seating",
      "Outdoor Shower",
      "Outdoor Spa / Jacuzzi",
      "Fully Fenced",
      "Shed / Storage",
      "Tennis Court",
      "Children’s Playground",
      "BBQ Pavilion"
    ]
  },
  climate: {
    label: 'Climate Control & Energy',
    list: [
      "Central Heating",
      "Ceiling Fans",
      "Water Tank",
      "Solar Panels",
      "Solar Hot Water",
      "Air Filtration System",
      "Energy-Efficient Windows",
      "Electric Stove System"
    ]
  },
  special: {
    label: 'Special Features',
    list: [
      "Pet Friendly",
      "Wheelchair Accessible",
      "Lake View",
      "Sea View",
      "Mountain View",
      "Near School",
      "Near Public Transport",
      "Near Supermarket",
      "Near Hospital/Clinic",
      "Gated Community"
    ]
  },
  safety: {
    label: 'Safety & Security',
    list: [
      "CCTV",
      "24/7 Security",
      "Smoke Detectors",
      "Fire Extinguishers",
      "Security Patrol",
      "Gated Entry",
      "Intercom System"
    ]
  },
  kitchen: {
    label: 'Kitchen Features',
    list: [
      "Modern Kitchen",
      "Pantry",
      "Granite Countertops",
      "Island Counter",
      "Double Oven",
      "Gas Stove",
      "Wine Cooler"
    ]
  },
  recreation: {
    label: 'Recreational Facilities',
    list: [
      "Clubhouse",
      "Billiards Room",
      "Game Room",
      "Library",
      "Basketball Court",
      "Jogging Track"
    ]
  }
};
