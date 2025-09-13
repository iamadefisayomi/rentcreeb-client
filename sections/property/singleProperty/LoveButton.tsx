'use client';

import { useAuth } from '@/hooks/useAuth';
import useAlert from '@/hooks/useAlert';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { addToFavourites } from '@/actions/favourites';
import { ShowToolTip } from '@/components/showTooTip';

interface LoveButtonProps {
  propertyId: any;
  className?: string;
  favourites: string[]
}

export default function LoveButton({
  propertyId,
  className = '',
  favourites
}: LoveButtonProps) {

  const { user } = useAuth();
  const { setAlert } = useAlert();
  const [favouritesIds, setFavouritesId] = useState(favourites || [])

  const isLiked = favouritesIds.includes(propertyId);

   const toggleFavourite = async () => {
    if (!user) return setAlert('Login to continue', 'info');

    const prevFavourites = [...favouritesIds];
    let updatedFavourites: string[];

    // Optimistically update favourites
    if (isLiked) {
      updatedFavourites = favouritesIds.filter(id => id !== propertyId);
    } else {
      updatedFavourites = [...favouritesIds, propertyId];
    }

    setFavouritesId(updatedFavourites);

    // Make server request
    const res = await addToFavourites(propertyId);

    if (!res.success) {
      setFavouritesId(prevFavourites); // rollback
      setAlert(res.message || 'Failed to update favourite', 'error');
    } else {
      const message = res.data ? 'Added to favourites' : 'Removed from favourites';
      setAlert(message, 'info');
    }
  };


  return (
    <ShowToolTip
      title={
        user
          ? isLiked
            ? 'Remove from favourites'
            : 'Add to favourites'
          : 'Login to like'
      }
    >
      <Button
          onClick={toggleFavourite}
          size="icon"
          variant='outline'
          className='border-none rounded-full'
        >
          <Heart
            className="text-muted-foreground w-5"
            fill={isLiked ? 'currentColor' : 'none'}
          />
        </Button>
    </ShowToolTip>
  );
}
