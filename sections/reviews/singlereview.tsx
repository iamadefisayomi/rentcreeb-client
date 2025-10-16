"use client";

import Rating from "@/components/Rating";
import { Dot } from "lucide-react";
import { ReviewDocument } from "@/server/schema/Review";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PopulatedReview = ReviewDocument & {
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
};

export default function SingleReview({ review }: { review: PopulatedReview }) {
  return (
    <div className="w-full flex flex-col gap-2 items-start">
      <div className="font-medium flex w-full items-center gap-1">
        <span className="text-xs capitalize text-muted-foreground flex items-center gap-1">
          <Rating className="text-primary w-3" length={review.rating} />{" "}
          {review.rating}
        </span>
        <Dot className="size-1 text-gray-300" />
        <span className="text-xs capitalize text-muted-foreground">
          {review.userId?.name}
        </span>
        <Dot className="size-1 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground lowercase">
          {dayjs(review.createdAt).fromNow()}
        </span>
      </div>
      {review.message && (
        <p className="text-xs text-muted-foreground">{review.message}</p>
      )}
    </div>
  );
}
