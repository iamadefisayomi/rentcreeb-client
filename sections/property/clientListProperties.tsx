"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PropertyDocument } from "@/server/schema/Property";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyLayout from "./propertyLayout";
import { useSearchParams } from "next/navigation";

interface Props {
  initialProperties: PropertyDocument[];
  initialPage: number;
  favs?: any[];
  limit?: number;
}

export default function ClientListProperties({
  initialProperties,
  initialPage,
  favs,
  limit = 20,
}: Props) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [properties, setProperties] = useState(initialProperties);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialProperties.length === limit
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Reset when URL changes
  useEffect(() => {
    setProperties(initialProperties);
    setPage(initialPage);
    setHasMore(initialProperties.length === limit);
  }, [queryString, initialProperties, initialPage, limit]);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const nextPage = page + 1;

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", nextPage.toString());
      params.set("limit", limit.toString());

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();


      if (!data.properties?.length) {
        setHasMore(false);
      } else {
        setProperties(prev => [...prev, ...data.properties]);
        setPage(nextPage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, searchParams, limit]);

  // 🔥 Infinite Scroll Observer
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
    return () => observer.disconnect();
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
              <Skeleton className="h-4 w-[250px]" />
            </div>
          ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </div>
  );
}