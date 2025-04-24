"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { UserButton } from "@clerk/nextjs"
import { Search } from "./icons"
import clsx from "clsx"

type SearchBarProps = {
 onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
 const [query, setQuery] = useState<string>("")
 const [visible, setVisible] = useState<boolean>(true)
 const [lastScrollY, setLastScrollY] = useState<number>(0)

 const debouncedSearch = useDebouncedCallback((value: string) => {
  onSearch(value.trim().toLowerCase())
 }, 300)

 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setQuery(value)
  debouncedSearch(value)
 }

 useEffect(() => {
  const handleScroll = () => {
   const currentY = window.scrollY

   if (currentY > lastScrollY && currentY > 0) {
    setVisible(false)
   } else {
    setVisible(true)
   }

   setLastScrollY(currentY)
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
 }, [lastScrollY])

 return (
  <header className={clsx(
   "w-full fixed top-0 left-0 right-0 transition-all duration-500 z-40 p-2 bg-[#f6fafe]",
   visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"
  )}>
   <div className="flex relative bg-[#deeaf1] rounded-full">
    <Search className="absolute inset-y-[13px] left-4 pointer-events-none text-[#40484c]" />
    <input
     type="text"
     placeholder="Search"
     value={query}
     onChange={handleChange}
     className="w-full px-12 py-3 text-[#40484c] border-none outline-none"
    />
    <div className="inline-flex items-center justify-center absolute inset-y-[13px] rounded-full right-4 cursor-pointer">
     <UserButton />
    </div>
   </div>
  </header>
 )
}