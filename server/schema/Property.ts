import { Query, Schema, Types, model, models } from 'mongoose';
import { NewPropertySchemaType } from '@/sections/dashboard/formSchemas';

export interface PropertyDocument extends Omit<NewPropertySchemaType, 'location'> {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  slug?: string;
  views: number | null;
  favorites?: number;
  isFeatured?: boolean;
  priority: number | null;
  inquiries: number | null;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
  isApproved?: boolean;
  approvedAt?: Date;
  isDeleted?: boolean;
  isAvailable?: boolean;

  // computed
  averageRating?: number;
  reviewCount?: number;
}

const PropertySchema = new Schema<PropertyDocument>(
  {
    // Core Info
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    listedIn: { type: String, required: true },
    status: { type: String, required: true },

    // Pricing & Features
    price: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },

    bedrooms: { type: Number, default: 1, required: true },
    bathrooms: { type: Number, default: 1, required: true },
    kitchens: { type: Number, default: 1, required: true },
    parking: { type: Number, default: 1, required: true },

    // Extra Details
    yearBuilt: { type: Number, default: null },
    floorArea: { type: Number, default: null },
    landArea: { type: Number, default: null },
    furnished: { type: String, default: null },
    floorNumber: { type: Number, default: null },
    totalFloors: { type: Number, default: null },
    propertyCondition: { type: String, default: null },
    orientation: { type: String, default: null },

    // Location
    country: { type: String, default: 'nigeria' },
    state: { type: String, default: 'lagos' },
    city: { type: String, required: true },
    zip: { type: String, default: '' },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] },
    },

    // Utilities & Amenities
    waterSupply: { type: String, default: null },
    electricity: { type: String, default: null },
    // gasSupply: { type: Boolean, default: null },
    // elevator: { type: Boolean, default: null },
    // swimmingPool: { type: Boolean, default: null },

    // Media
    videoLink: { type: String, default: null },
    videoFrom: { type: String, default: 'youtube' },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (val: string[]) => val.length >= 5 && val.length <= 30,
        message: 'You must provide between 5 and 30 images.',
      },
    },
    floorPlan: { type: [String], default: [] },
    // virtualTourLink: { type: String, default: null },
    brochure: { type: String, default: null },
    // coverImageIndex: { type: Number, default: null },

    // Feature Categories
    general: { type: [String], default: [] },
    indoor: { type: [String], default: [] },
    outdoor: { type: [String], default: [] },
    climate: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    special: { type: [String], default: [] },

    // Availability Dates
    availableFrom: { type: Date, default: null },
    availableTo: { type: Date, default: null },
    constructionStatus: { type: String, default: null },
    handoverDate: { type: Date, default: null },

    // Ownership & Legal
    ownerName: { type: String, default: null },
    ownerContact: { type: String, default: null },
    deedNumber: { type: String, default: null },
    isVerified: { type: Boolean, default: false },

    // Marketing & Tracking
    priority: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },

    // Publication
    published: { type: Boolean, default: true },

    // DB-only fields
    userId: { type: String, ref: 'User', required: true },
    favorites: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },

    // Computed fields (kept in sync by Review hooks)
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
PropertySchema.index({ location: '2dsphere' });

// Query middleware (exclude soft-deleted)
PropertySchema.pre<Query<PropertyDocument, PropertyDocument>>(/^find/, function () {
  this.where({ isDeleted: false });
});
PropertySchema.pre('aggregate', function () {
  const pipeline = this.pipeline();
  const first = pipeline[0];
  if (!first || !('$match' in first)) {
    pipeline.unshift({ $match: { isDeleted: false } });
  } else {
    first.$match.isDeleted = false;
  }
});

// Virtual relation to reviews
PropertySchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'propertyId',
  localField: '_id',
});

PropertySchema.set('toObject', { virtuals: true, versionKey: false });
PropertySchema.set('toJSON', { virtuals: true, versionKey: false });

export default models.Property || model<PropertyDocument>('Property', PropertySchema);
