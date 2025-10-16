import { cn } from "@/lib/utils";
import ReviewsForm from "./ReviewsForm";
import { ReviewDocument } from "@/server/schema/Review";
import SingleReview from "./singlereview";
import { getReviews } from "@/actions/reviews";

type PopulatedReview = ReviewDocument & {
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
};

export default async function Reviews({ propertyId, reviews }: { propertyId: string, reviews: PopulatedReview[] }) {

  return (
    <div className="w-full mx-auto flex items-start py-12 justify-center min-h-[70vh] px-4 bg-slate-200/20">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Section heading */}
        <div className="w-full flex flex-col items-center gap-1">
          <p className="text-xs font-medium uppercase text-primary">
            leave a review
          </p>
          <h2 className="text-3xl text-slate-800 font-bold text-center capitalize">
            review
          </h2>
        </div>

        {/* Layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reviews list */}
          <div className="w-full md:col-span-2 flex flex-col items-start gap-3 md:gap-4 border rounded-2xl p-6 bg-white">
            <h2 className="text-sm text-slate-800 font-semibold">
              {reviews.length > 0 ? "reviews" : "Be the first to give a review"}
            </h2>

            <div className="w-full flex flex-col max-h-[500px] overflow-y-auto">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div
                    key={review._id.toString()}
                    className={cn(
                      "py-4",
                      index !== reviews.length - 1 && "border-b"
                    )}
                  >
                    <SingleReview review={review} />
                  </div>
                ))
              ) : (
                <div className="w-full flex-grow h-full flex-col flex items-center justify-center">
                  <img src="/reviews.svg" alt="" className="w-[80%] h-[90%]" />
                </div>
              )}
            </div>
          </div>

          {/* Review form */}
          <div className="md:col-span-1 w-full">
            <ReviewsForm propertyId={propertyId} />
          </div>
        </div>
      </div>
    </div>
  );
}
