// stores/favouriteStore.ts
import { create } from 'zustand';
import { addToFavourites } from '@/actions/favourites';

type FavouriteStore = {
  favourites: Set<string>;
  loading: boolean;
  initFavourites: (ids: string[]) => void;
  toggleFavourite: (propertyId: string, setAlert?: any) => Promise<void>;
  isFavourited: (propertyId: string) => boolean;
};

export const useFavouriteStore = create<FavouriteStore>((set, get) => ({
  favourites: new Set<string>(),
  loading: false,

  // Initialize favourites from server
  initFavourites: (ids: string[]) => {
    const cleanIds = ids.filter((id): id is string => typeof id === 'string');
    set({ favourites: new Set(cleanIds) });
  },

  // Toggle favourite (optimistic)
  toggleFavourite: async (propertyId, setAlert) => {
    const prevFavourites = new Set(get().favourites);
    const isFav = prevFavourites.has(propertyId);
    const updatedFavourites = new Set(prevFavourites);

    if (isFav) {
      updatedFavourites.delete(propertyId);
    } else {
      updatedFavourites.add(propertyId);
    }

    // Optimistically update UI
    set({ favourites: updatedFavourites });

    const res = await addToFavourites(propertyId);

    if (!res.success) {
      // Roll back
      set({ favourites: prevFavourites });
      setAlert(res.message || 'Failed to update favourite', 'error');
    } else {
      const message = res.data ? 'Added to favourites' : 'Removed from favourites';
      setAlert(message, 'info');
    }
  },

  // Check if property is favourited
  isFavourited: (propertyId) => {
    return get().favourites.has(propertyId);
  },
}));
