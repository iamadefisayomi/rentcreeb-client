"use client";

import React, { useState, useEffect, useMemo, ReactNode } from "react";
import Autosuggest from "react-autosuggest";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { NEXT_PUBLIC_BASE_URL } from "@/constants";
import useCookies from "@/hooks/useCookies";

interface Ward {
  name?: string;
  latitude?: number;
  longitude?: number;
}

interface LGA {
  name?: string;
  wards?: Ward[];
  latitude?: number;
  longitude?: number;
}

interface StateData {
  state?: string;
  lgas?: LGA[];
  latitude?: number;
  longitude?: number;
}

interface LocationItem {
  state?: string;
  lga?: string;
  ward?: string;
  coordinates?: [number, number]; // [lon, lat]
}

interface NigeriaLocationSearchProps {
  setLocation: (location: LocationItem | null) => void;
  defaultValue?: string;
}

export default function AddressAutocomplete({
  setLocation,
  defaultValue,
}: NigeriaLocationSearchProps) {
  const [locationsList, setLocationsList] = useState<LocationItem[]>([]);
  const [value, setValue] = useCookies(
    "autocompleteAddress",
    defaultValue || "",
    24
  );
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);

  // Fetch states + lgas + wards
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/states-data`, {
          cache: "force-cache",
        });

        if (!res.ok) throw new Error("Failed to fetch states data");

        const data: {
          success: boolean;
          message: string;
          data: StateData[];
        } = await res.json();

        if (!data.success) throw new Error(data.message);

        const compiled: LocationItem[] = [];

        data.data.forEach((state) => {
          if (!state.state) return;

          // ✅ push state alone
          compiled.push({
            state: state.state,
            coordinates:
              state.latitude && state.longitude
                ? [state.longitude, state.latitude]
                : undefined,
          });

          state.lgas?.forEach((lga) => {
            if (!lga.name) return;

            // ✅ push lga + state
            compiled.push({
              state: state.state,
              lga: lga.name,
              coordinates:
                lga.latitude && lga.longitude
                  ? [lga.longitude, lga.latitude]
                  : undefined,
            });

            lga.wards?.forEach((ward) => {
              if (!ward.name) return;

              // ✅ push ward + lga + state
              compiled.push({
                state: state.state,
                lga: lga.name,
                ward: ward.name,
                coordinates:
                  ward.latitude && ward.longitude
                    ? [ward.longitude, ward.latitude]
                    : undefined,
              });
            });
          });
        });

        setLocationsList(compiled);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocations();
  }, []);

  // Fuse.js config
  const fuse = useMemo(() => {
  if (!locationsList.length) return null;
  return new Fuse(locationsList, {
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    findAllMatches: true,
    keys: [
      { name: "state", weight: 0.7 },
      { name: "lga",   weight: 0.2 },
      { name: "ward",  weight: 0.1 },
    ],
  });
}, [locationsList]);
// 
function rankItem(
  it: LocationItem,
  q: string,
  score: number | undefined
): number {
  const s = (it.state || "").toLowerCase();
  const l = (it.lga || "").toLowerCase();
  const w = (it.ward || "").toLowerCase();
  const isStateOnly = !!it.state && !it.lga && !it.ward;

  if (isStateOnly && s === q) return 0;        // exact state match
  if (isStateOnly && s.startsWith(q)) return 0.5; // prefix state match
  if (isStateOnly && s.includes(q)) return 0.75;  // substring state match

  if (!it.ward && l === q) return 1.5;         // exact LGA (no ward)
  if (w === q) return 2;                        // exact ward

  // fallback to Fuse score (lower is better), padded so state-first wins
  return 3 + (score ?? 1);
}

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    const q = value.trim().toLowerCase();
    if (!fuse || !q) {
      setSuggestions([]);
      return;
    }

    const results = fuse.search(value); // returns { item, score }
    const ranked = results
      .sort(
        (a, b) => rankItem(a.item, q, a.score) - rankItem(b.item, q, b.score)
      )
      .map(r => r.item);

    // De-dup by the visible label so identical strings don't repeat
    const seen = new Set<string>();
    const unique: LocationItem[] = [];
    for (const it of ranked) {
      const label = getSuggestionValue(it);
      if (!seen.has(label)) {
        seen.add(label);
        unique.push(it);
      }
      if (unique.length >= 15) break; // keep it snappy
    }

    setSuggestions(unique);
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const getSuggestionValue = (suggestion: LocationItem) => {
    if (suggestion.ward) {
      return `${suggestion.ward}, ${suggestion.lga}, ${suggestion.state}`;
    }
    if (suggestion.lga) {
      return `${suggestion.lga}, ${suggestion.state}`;
    }
    return suggestion.state || "";
  };

  const renderSuggestion = (suggestion: LocationItem) => {
    const label = getSuggestionValue(suggestion);
    return (
      <div
        className="p-2 text-xs text-muted-foreground hover:bg-slate-200 hover:text-black truncate"
        title={label}
      >
        {label}
      </div>
    );
  };

  const renderInputComponent = (inputProps: any) => (
    <Input {...inputProps} className="w-full" />
  );

  const renderSuggestionsContainer = ({
    containerProps,
    children,
  }: {
    containerProps: any;
    children: ReactNode;
  }) => {
    const { ref, ...restProps } = containerProps;
    const handleRef = (node: HTMLElement | null) => {
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    };
    return (
      <div className="w-full overflow-y-auto" ref={handleRef} {...restProps}>
        {children}
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        renderSuggestionsContainer={renderSuggestionsContainer}
        onSuggestionSelected={(_e, { suggestion }) => {
          setLocation({
            ...suggestion,
            coordinates: suggestion.coordinates,
          });
          setValue(getSuggestionValue(suggestion));
          setSuggestions([]); // close dropdown
        }}
        inputProps={{
          placeholder: "Search state, local gov, or city...",
          value,
          onChange: (_e, { newValue }) => setValue(newValue),
        }}
      />
      <style jsx global>{`
        .react-autosuggest__suggestions-container {
          max-height: 300px;
          overflow-y: auto;
          background-color: white;
          position: absolute;
          width: 100%;
          z-index: 50;
          border-radius: 0 0 4px 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .react-autosuggest__suggestions-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .react-autosuggest__suggestion {
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
