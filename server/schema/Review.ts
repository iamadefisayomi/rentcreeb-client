import { Schema, Types, model, models } from 'mongoose';
import Property from './Property';

export interface ReviewDocument {
  _id: Types.ObjectId;
  propertyId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  message: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for performance
ReviewSchema.index({ propertyId: 1 });
ReviewSchema.index({ userId: 1, propertyId: 1 }, { unique: true }); // one review per user per property

// --- Helper: update rating after CRUD
async function updatePropertyRating(propertyId: Types.ObjectId) {
  const stats = await Review.aggregate([
    { $match: { propertyId, isApproved: true } },
    {
      $group: {
        _id: '$propertyId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
}

// Hooks
ReviewSchema.post('save', function () {
  updatePropertyRating(this.propertyId);
});
ReviewSchema.post('findOneAndUpdate', function (doc: any) {
  if (doc) updatePropertyRating(doc.propertyId);
});
ReviewSchema.post('findOneAndDelete', function (doc: any) {
  if (doc) updatePropertyRating(doc.propertyId);
});

const Review = models.Review || model<ReviewDocument>('Review', ReviewSchema);
export default Review;
