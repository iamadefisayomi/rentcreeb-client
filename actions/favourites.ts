'use server';

import Favourite from '@/server/schema/Favourite';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';
import Routes from '@/Routes';
import Property from '@/server/schema/Property';


export async function addToFavourites(propertyId: string) {
  try {
    if (!propertyId || typeof propertyId !== 'string') {
      throw new Error('Invalid property ID');
    }

    const { data: user, success, message } = await getCurrentUser();
    if (!success || !user) {
      throw new Error(message || 'Not authenticated');
    }

    const property = await Property.findById(propertyId);
    if (!property || property.userId.toString() === user.id) {
      throw new Error('You cannot favourite your property!');
    }

    const existingFav = await Favourite.findOne({ userId: user.id });

    let added = false;

    if (existingFav) {
      const isFavourited = existingFav.propertiesId.some(
        (id: any) => id.toString() === propertyId
      );

      const updatedPropertiesId = isFavourited
        ? existingFav.propertiesId.filter((id: any) => id.toString() !== propertyId)
        : [...existingFav.propertiesId, propertyId];

      existingFav.propertiesId = updatedPropertiesId;
      await existingFav.save();

      added = !isFavourited;

      // Update property favourites count
      await Property.findByIdAndUpdate(propertyId, {
        $inc: { favorites: added ? 1 : -1 },
      });
    } else {
      await Favourite.create({
        userId: user.id,
        propertiesId: [propertyId],
      });
      added = true;

      // First favourite → increment
      await Property.findByIdAndUpdate(propertyId, {
        $inc: { favorites: 1 },
      });
    }

    revalidatePath(Routes.dashboard.engagement.favourites);

    return {
      success: true,
      data: added,
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      message: err?.message || 'Something went wrong',
    };
  }
}



// 
export async function getUserFavourites() {
  try {
    const { data: user, success, message } = await getCurrentUser();
    if (!success || !user) throw new Error(message || 'User not found');

    const fav = await Favourite.findOne({ userId: user.id })
      .populate({
        path: 'propertiesId',
        match: { isDeleted: false },
        model: 'Property',
        options: { lean: true }, // use lean to get plain JS objects
        select: '-someBufferField', // exclude buffers if any
      });

    return {
      success: true,
      data: fav?.propertiesId || [],
    };
  } catch (err: any) {
    return {
      success: false,
      data: [],
      message: err.message || 'Something went wrong',
    };
  }
}
