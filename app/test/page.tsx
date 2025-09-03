"use client";
import AddressAutocomplete from "@/sections/Autocomplete/AddressAutocomplete";
import { useState } from "react";

export default function NigeriaLocationSearch() {

    const [location, setLocation] = useState<any>({})
 
  return (
    <div className="w-full max-w-sm">
      <AddressAutocomplete setLocation={setLocation} />
      <pre>{JSON.stringify(location, null, 2)}</pre>

      Hello test
    </div>
  );
}
