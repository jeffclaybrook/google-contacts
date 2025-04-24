/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

type AddressAutocompleteProps = {
 value: string
 onChange: (value: string) => void
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function AddressAutocomplete({ value, onChange }: AddressAutocompleteProps) {
 const [query, setQuery] = useState(value)
 const [suggestions, setSuggestions] = useState<string[]>([])
 const skipFetch = useRef(false)
 const hasInteracted = useRef(false)

 const fetchSuggestions = useDebouncedCallback(async (q: string) => {
  if (!q || skipFetch.current || !hasInteracted.current) {
   skipFetch.current = false
   return
  }
  
  const res = await fetch(
   `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?country=US&access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`
  )

  const data = await res.json()
  const results = data.features?.map((feature: any) => feature.place_name) || []
  setSuggestions(results)
 }, 300)

 useEffect(() => {
  fetchSuggestions(query)
 }, [query])

 return (
  <div className="relative w-full group z-50 cursor-text">
   <input
    type="text"
    id="address"
    name="address"
    placeholder=" "
    value={query}
    onChange={(e) => {
     setQuery(e.target.value)
     hasInteracted.current = true
    }}
    required
    className="block px-2.5 pb-3 pt-3 w-full bg-transparent rounded-sm border border-[#6e767b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#176684] focus:border-[#176684] peer"
   />
   <label
    htmlFor="address"
    className="absolute text-[#40484c] bg-[#f6fafe] px-1 translate-x-3 duration-300 transform -translate-y-4 scale-75 top-0.75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#176684]"
   >
    Address
   </label>
   {suggestions.length > 0 && (
    <ul className="absolute mt-1 w-full bg-[#f6fafe] border border-gray-300 rounded shadow-sm max-h-48 overflow-y-auto z-50">
     {suggestions.map((suggestion, i) => (
      <li
       key={i}
       className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
       onClick={() => {
        onChange(suggestion)
        setQuery(suggestion)
        setSuggestions([])
        skipFetch.current = true
       }}
      >
       {suggestion}
      </li>
     ))}
    </ul>
   )}
  </div>
 )
}