export const _properties = [
    { image: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/link1' },
    { image: 'https://plus.unsplash.com/premium_photo-1676321046449-5fc72b124490?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvcGVydGllc3xlbnwwfHwwfHx8MA%3D%3D', link: '/link2' },
    { image: 'https://plus.unsplash.com/premium_photo-1675615949585-36aaf4cb778d?q=80&w=1906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/link3' },
    { image: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvcGVydGllc3xlbnwwfHwwfHx8MA%3D%3D', link: '/link4' },
    { image: 'https://plus.unsplash.com/premium_photo-1661883964999-c1bcb57a7357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvcGVydGllc3xlbnwwfHwwfHx8MA%3D%3D', link: '/link5' }
  ];


  export const _securities = [
    "alerm", 'access gate', 'electric fence', 'security post'
  ]
  export const _amenities = [
    "pool", 'furnished', 'patio / balcony', 'pet friendly', 'water included', 'electricy included'
  ]

  export const _rentalTaglines = [
    "Your Reliable Home Rental Partner",
    "Your Go-To Home Rental Solution",
    "The Trusted Name in Home Rentals",
    "Find Your Perfect Home with Us",
    "Rent with Confidence, Live with Ease",
    "Seamless Home Rentals, Just for You",
    "Your Hassle-Free Home Rental Partner",
    "Where Trust Meets Home Rentals",
    "Secure, Simple, and Trusted Home Rentals",
    "Helping You Find a Home You Love",
    "Your Partner in Stress-Free Renting",
    "Making Home Rentals Easy and Reliable",
    "Your Trusted Guide to the Perfect Rental",
    "Find. Rent. Relax. We’ve Got You Covered.",
    "A Better Way to Rent a Home",
  ];
  export const _getTagline = () => {
    const randomIndex = Math.floor(Math.random() * _rentalTaglines.length);
    return _rentalTaglines[randomIndex];
  }

  
export const _experienceOptions = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "10+ years",
] as const;

export const _specializationOptions = [
  "Residential Real Estate",
  "Commercial Real Estate",
  "Luxury Real Estate",
  "Property Management",
  "Real Estate Investment",
  "Real Estate Appraisal",
  "Industrial Real Estate",
  "Vacation and Resort Real Estate",
  "Real Estate Development",
  "Foreclosure and Short Sales",
] as const;

export const _listedIn = [
  "all",
  "rent",
  "buy",
  "short-let",
]

export const _status = [
  "active",
  "hot offer",
  "new offer",
  "not active",
  "sold"
]




export const _generalAmenities = {
  general: {
    label: 'general amenities',
    list: [
      "Air Conditioning",
      "Wi-Fi",
      "Parking",
      "Swimming Pool",
      "Refrigerator",
      "Laundry",
      "TV Cable",
      "Barbeque",
      "Fireplace",
      "Microwave",
    ]
  },
  indoor: {
    label: 'indoor features',
    list: [
      "Indoor Features",
      "Ensuite",
      "Study",
      "Rumpus Room",
      "Built-in Robes",
      "Dishwasher",
      "Alarm System",
      "Floorboards",
      "Gym",
      "Broadband",
      "Projector Room",
      "Elevator",
      "Ceiling Height",
    ]
  },
 outdoor: {
  label: 'outdoor features',
  list: [
    "Balcony",
    "Backyard",
    "Front Yard",
    "Garden",
    "Outdoor Area",
    "Outdoor Shower",
    "Outdoor Spa",
    "Fully Fenced",
    "Shed",
    "Tennis Court",
 ]
 },
 climate: {
  label: 'climate control & energy',
  list: [
    "Heating",
    "Water Tank",
    "Solar Panels",
    "Solar Hot Water",
    "Dust Filter",
    "Electric Stove System",
 ]
 },
 special: {
  label: 'special features',
  list: [
    "Special Features",
    "Pet Friendly",
    "Disabled Access",
    "Lake View",
    "School",
    "Transportation Hub",
    "Supermarket",
    "Clinic"
 ]
 }
}

export const _favouriteSort = [
  "newest",
  "best seller",
  "best match",
  "price low",
  "price high",
]

export const _reviewsSort = [
  "Newest",
  "Oldest",
  "Most relevant",
  "Highest rated",
  "Lowest rated",
  "Most helpful",
]