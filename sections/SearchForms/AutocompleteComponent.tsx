"use client"

import { Input } from "@/components/ui/input";
import useAutocomplete from "@/hooks/useAutocomplete";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect, useCallback } from "react";

interface AutocompleteProps {
  setLocation?: (location: any) => void;
  className?: string;
  simple?: boolean;
  defaultValue?: string;
}

const AutocompleteComponent: React.FC<AutocompleteProps> = ({ setLocation, className, simple, defaultValue }) => {
  const { query, setQuery, results, loading, error } = useAutocomplete({simple, defaultValue});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSetQuery = useCallback(
    (data: any) => {
      if (setLocation) setLocation(data);
      setQuery(`${data.address.name || ''}, ${data.address.county || ''}, ${data.address.state || ''}`);
      setIsDropdownOpen(false);
    },
    [setLocation, setQuery]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setLocation?.({})
    setIsDropdownOpen(true);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isDropdownOpen || results.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          setHighlightedIndex((prevIndex) =>
            prevIndex === null ? 0 : Math.min(prevIndex + 1, results.length - 1)
          );
          break;
        case "ArrowUp":
          setHighlightedIndex((prevIndex) =>
            prevIndex === null ? 0 : Math.max(prevIndex - 1, 0)
          );
          break;
        case "Enter":
          if (highlightedIndex !== null) {
            handleSetQuery(results[highlightedIndex]);
            event.preventDefault();
          }
          break;
        case "Escape":
          setIsDropdownOpen(false);
          break;
        default:
          break;
      }
    },
    [isDropdownOpen, results, highlightedIndex, handleSetQuery]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <Input
        placeholder="Enter a state, locality, or area"
        className={cn("bg-white h-9 text-muted-foreground lowercase truncate", className)}
        type="text"
        value={query || defaultValue}
        onChange={handleChange}
        spellCheck={false}
      />

      {isDropdownOpen && results.length > 0 && (
        <ul className="absolute p-4 left-0 top-full mt-2 w-full bg-background border z-20 shadow-md rounded-md max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <li
              className={`p-2 text-xs lowercase text-muted-foreground bg-slate-50 border-b cursor-pointer hover:bg-muted transition ${
                highlightedIndex === index ? "bg-muted" : ""
              }`}
              key={index}
              onClick={() => handleSetQuery(result)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {`${result.address.name || ""}, ${result.address.county || ""}, ${result.address.state || ""}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteComponent;
