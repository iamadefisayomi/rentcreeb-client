"use client"

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash-es";
import useCookies from "./useCookies";

const locationIQTOKEN = process.env.NEXT_PUBLIC_LOCATION_IQ_TOKEN;
const locationIQURL = locationIQTOKEN
  ? `https://api.locationiq.com/v1/autocomplete?key=${locationIQTOKEN}&countrycodes=NG&q=`
  : "";

const cache = new Map<string, any[]>();

const fetchAutocompleteResults = async (query: string): Promise<any[]> => {
  if (cache.has(query)) {
    return cache.get(query)!;
  }

  if (!locationIQURL) {
    console.error("LocationIQ token is missing");
    return [];
  }

  try {
    const { data } = await axios.get(`${locationIQURL}${query}`);
    cache.set(query, data);
    return data;
  } catch (error) {
    console.error("Error fetching autocomplete data:", error);
    return [];
  }
};

const useAutocomplete = ({simple, defaultValue}: {simple?: boolean, defaultValue?: string}) => {
  const [query, setQuery] = simple ? useState(defaultValue || "") : useCookies<string>("locationQuery", defaultValue || "", 24);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (query: string) => {
        setLoading(true);
        setError(null);
        const data = await fetchAutocompleteResults(query);
        setResults(data);
        setLoading(false);
      }, 300),
    []
  );

  useEffect(() => {
    if (query.length > 1) {
      debouncedFetch(query);
    } else {
      setResults([]);
      setLoading(false);
    }

    return () => debouncedFetch.cancel();
  }, [query, debouncedFetch]);

  return { query, setQuery, results, loading, error };
};

export default useAutocomplete;
