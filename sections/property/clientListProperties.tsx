"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PropertyDocument } from "@/server/schema/Property";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyLayout from "./propertyLayout";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchX, Home } from "lucide-react";

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
  const [similarProperties, setSimilarProperties] = useState<PropertyDocument[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProperties.length === limit);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Reset and handle "No Results" logic
  useEffect(() => {
    setProperties(initialProperties);
    setPage(initialPage);
    setHasMore(initialProperties.length === limit);

    if (initialProperties.length === 0) {
      fetchSimilarProperties();
    } else {
      setSimilarProperties([]);
    }
  }, [queryString, initialProperties, initialPage, limit]);

  const fetchSimilarProperties = async () => {
    try {
      // Fetch similar by relaxing the query (e.g., keep only listedIn and type)
      const params = new URLSearchParams();
      params.set("listedIn", searchParams.get("listedIn") || "for-rent");
      params.set("limit", "6"); 
      
      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      setSimilarProperties(data.properties || []);
    } catch (err) {
      console.error("Failed to fetch similar properties", err);
    }
  };

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

  useEffect(() => {
    const current = sentinelRef.current;
    if (!current || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { rootMargin: "300px" }
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, [fetchMore, hasMore]);

  // --- UI Components ---

  if (properties.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-muted rounded-full p-6 mb-4">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">No properties found</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          We couldn't find any listings matching your current filters. Try adjusting your price range or location.
        </p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => window.location.href = window.location.pathname}
        >
          Clear all filters
        </Button>

        {similarProperties.length > 0 && (
          <div className="w-full mt-16">
            <div className="flex items-center gap-2 mb-6 justify-start border-b pb-2">
              <Home className="size-6 text-primary" />
              <h3 className="text-lg font-semibold">Properties you might like</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarProperties.map(property => (
                <PropertyLayout
                  key={property._id.toString()}
                  property={property}
                  favourites={favs?.map(res => res.id) || []}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

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
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex flex-col space-y-3">
              <Skeleton className="h-[255px] rounded-xl" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-20" />}
    </div>
  );
}