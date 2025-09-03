import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFavourite extends Document {
  userId: Types.ObjectId;
  propertiesId: Types.ObjectId[];
}

const FavouriteSchema = new Schema<IFavourite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    propertiesId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
  },
  {
    timestamps: true,
  }
);

FavouriteSchema.set('toObject', { virtuals: true, versionKey: false });

export default mongoose.models.Favourite ||
  mongoose.model<IFavourite>('Favourite', FavouriteSchema);
