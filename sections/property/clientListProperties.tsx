"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { PropertyDocument } from "@/server/schema/Property";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyLayout from "./propertyLayout";

interface Props {
  initialProperties: PropertyDocument[];
  filters: Record<string, any>;
  sortBy?: string;
  favs?: any[];
  limit?: number;
}

export default function ClientListProperties({ initialProperties, filters, sortBy, favs, limit = 20 }: Props) {
  const [properties, setProperties] = useState<PropertyDocument[]>(initialProperties);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = useCallback(async () => {
  if (loading || !hasMore) return;

  setLoading(true);

  setPage(prevPage => {
    const nextPage = prevPage + 1;

    const params = new URLSearchParams({
      page: nextPage.toString(),
      limit: limit.toString(),
      sortBy: sortBy || "",
      ...Object.fromEntries(
        Object.entries(filters).map(([k, v]) => [k, String(v)])
      ),
    });

    fetch(`/api/properties?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (!data.properties?.length) {
          setHasMore(false);
        } else {
          setProperties(prev => [...prev, ...data.properties]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    return nextPage;
  });
}, [filters, sortBy, loading, hasMore, limit]);

  useEffect(() => {
    const current = sentinelRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [fetchMore]);

  return (
    <div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map(property => (
          <PropertyLayout
            key={property._id.toString()}
            property={property}
            favourites={favs?.map(res => res.id) || []}
          />
        ))}
      </div>

      {loading && (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex flex-col space-y-3">
              <Skeleton className="h-[255px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-1"></div>}
    </div>
  );
}