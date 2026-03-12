"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyLayout from "./propertyLayout";
import { PropertyDocument } from "@/server/schema/Property";
import { getSimilarProperties } from "@/actions/properties";

interface SimilarPropertiesProps {
  propertyId: string;
  batchSize?: number; // number of properties to fetch per batch
}

export default function SimilarProperties({
  propertyId,
  batchSize = 6,
}: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<PropertyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const batchRef = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchBatch = useCallback(
    async (limit: number) => {
      const controller = new AbortController();
      setLoading(true);

      try {
        const data = await getSimilarProperties(propertyId, limit * (batchRef.current + 1));
        if (!data) return;

        setProperties(data);
        batchRef.current += 1;
        setHasMore(data.length === limit * batchRef.current);
      } catch (err) {
        console.error("Failed to fetch similar properties", err);
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    },
    [propertyId]
  );

  // Initial fetch
  useEffect(() => {
    batchRef.current = 0;
    setProperties([]);
    setHasMore(true);
    fetchBatch(batchSize);
  }, [propertyId, batchSize, fetchBatch]);

  // IntersectionObserver for lazy-loading
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchBatch(batchSize);
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore, batchSize, fetchBatch]);

  const skeletonCount = loading ? batchSize : 0;

  return (
    <div className="w-full bg-muted min-h-[50vh] flex flex-col items-center justify-center px-2 py-10">
      <div className="w-full h-full max-w-8xl flex flex-col items-center">
        <h2 className="text-2xl text-gray-700 font-semibold capitalize mb-6">
          similar properties
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-3 py-6">
          {properties.map((property) => (
            <PropertyLayout key={property._id.toString()} property={property} />
          ))}

          {Array.from({ length: skeletonCount }).map((_, idx) => (
            <div key={`skeleton-${idx}`} className="flex flex-col space-y-3">
              <Skeleton className="h-[255px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>

        {!loading && properties.length === 0 && (
          <p className="text-gray-500 text-sm mt-4">No similar properties found.</p>
        )}

        {/* Invisible div for IntersectionObserver */}
        <div ref={loadMoreRef} />
      </div>
    </div>
  );
}