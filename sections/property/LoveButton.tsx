'use client';

import { useAuth } from '@/hooks/useAuth';
import useAlert from '@/hooks/useAlert';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from 'react';
import { addToFavourites } from '@/actions/favourites';

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
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          onClick={toggleFavourite}
          size="icon"
          className={`rounded-full w-8 h-8 p-1 flex items-center justify-center 
            bg-white hover:bg-slate-50 ${className}`}
        >
          <Heart
            className="text-red-500 w-5"
            fill={isLiked ? 'currentColor' : 'none'}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {user
          ? isLiked
            ? 'Remove from favourites'
            : 'Add to favourites'
          : 'Login to favourite'}
      </TooltipContent>
    </Tooltip>
  );
}
