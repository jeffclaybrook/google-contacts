"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import { useFormStatus } from "react-dom"
import { formatPhoneInput } from "@/lib/format-phone"
import type { Contact } from "@/types/contact"
import { useToast } from "./toast-provider"
import AddressAutocomplete from "./address-autocomplete"

type CreateFormProps = {
 onSuccess: () => void
 onContactCreated?: (newContact: Contact) => void
}

export default function CreateForm({ onSuccess, onContactCreated }: CreateFormProps) {
 const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  company: "",
  jobTitle: ""
 })

 const { showToast } = useToast()

 const { pending } = useFormStatus()

 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value })
 }

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  onSuccess()

  try {
   const res = await fetch("/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
   })
   if (res.ok) {
    const newContact = await res.json()
    onContactCreated?.(newContact)
    showToast({
     message: "Contact successfully created!",
     type: "success"
    })
   }
  } catch (error) {
   console.error("Unexpected error", error)
  }
 }

 return (
  <div className="max-w-md w-full mx-auto pt-4">
   <h2 className="text-[#1f1f1f] text-2xl text-center mb-6">Create Contact</h2>
   <form
    onSubmit={handleSubmit}
    className="flex flex-col gap-4 w-full"
   >
    <div className="relative w-full group z-0 cursor-text">
     <input
      type="text"
      name="firstName"
      id="firstName"
      value={form.firstName}
      onChange={handleChange}
      placeholder=" "
      required
      className="block px-2.5 pb-3 pt-3 w-full bg-transparent rounded-sm border border-[#6e767b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#176684] focus:border-[#176684] peer"
     />
     <label
      htmlFor="firstName"
      className="absolute text-[#40484c] bg-[#f6fafe] px-1 translate-x-3 duration-300 transform -translate-y-4 scale-75 top-0.75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#176684]"
     >
      First name
     </label>
    </div>
    <div className="relative w-full group z-0 cursor-text">
     <input
      type="text"
      name="lastName"
      id="lastName"
      value={form.lastName}
      onChange={handleChange}
      placeholder=" "
      required
      className="block px-2.5 pb-3 pt-3 w-full bg-transparent rounded-sm border border-[#6e767b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#176684] focus:border-[#176684] peer"
     />
     <label
      htmlFor="lastName"
      className="absolute text-[#40484c] bg-[#f6fafe] px-1 translate-x-3 duration-300 transform -translate-y-4 scale-75 top-0.75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#176684]"
     >
      Last name
     </label>
    </div>
    <div className="relative w-full group z-0 cursor-text">
     <input
      type="text"
      name="phone"
      id="phone"
      value={formatPhoneInput(form.phone)}
      onChange={(e) =>
       setForm((prev) => ({
        ...prev,
        phone: formatPhoneInput(e.target.value)
       }))
      }
      placeholder=" "
      required
      className="block px-2.5 pb-3 pt-3 w-full bg-transparent rounded-sm border border-[#6e767b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#176684] focus:border-[#176684] peer"
     />
     <label
      htmlFor="phone"
      className="absolute text-[#40484c] bg-[#f6fafe] px-1 translate-x-3 duration-300 transform -translate-y-4 scale-75 top-0.75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#176684]"
     >
      Phone
     </label>
    </div>
    <div className="relative w-full group z-0 cursor-text">
     <input
      type="email"
      name="email"
      id="email"
      value={form.email}
      onChange={handleChange}
      placeholder=" "
      required
      className="block px-2.5 pb-3 pt-3 w-full bg-transparent rounded-sm border border-[#6e767b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#176684] focus:border-[#176684] peer"
     />
     <label
      htmlFor="email"
      className="absolute text-[#40484c] bg-[#f6fafe] px-1 translate-x-3 duration-300 transform -translate-y-4 scale-75 top-0.75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#176684]"
     >
      Email
     </label>
    </div>
    <AddressAutocomplete
     value={form.address}
     onChange={(value) => setForm({ ...form, address: value })}
    />
    <div className="relative w-full group z-0 cursor-text">
     <input
      type="text"
      name="company"
      id="company"
      value={form.company}
      onChange={handleChange}
      placeholder=" "
      className="block px-2.5 pb-3 pt-3 w-full bg-transparent rounded-sm border border-[#6e767b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#176684] focus:border-[#176684] peer"
     />
     <label
      htmlFor="company"
      className="absolute text-[#40484c] bg-[#f6fafe] px-1 translate-x-3 duration-300 transform -translate-y-4 scale-75 top-0.75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#176684]"
     >
      Company
     </label>
    </div>
    <div className="relative w-full group z-0 cursor-text">
     <input
      type="text"
      name="jobTitle"
      id="jobTitle"
      value={form.jobTitle}
      onChange={handleChange}
      placeholder=" "
      className="block px-2.5 pb-3 pt-3 w-full bg-transparent rounded-sm border border-[#6e767b] appearance-none focus:outline-none focus:ring-1 focus:ring-[#176684] focus:border-[#176684] peer"
     />
     <label
      htmlFor="jobTitle"
      className="absolute text-[#40484c] bg-[#f6fafe] px-1 translate-x-3 duration-300 transform -translate-y-4 scale-75 top-0.75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#176684]"
     >
      Job title
     </label>
    </div>
    <button
     type="submit"
     aria-label="Create contact"
     disabled={pending}
     className="py-3 px-4 rounded-full bg-[#176684] text-white cursor-pointer"
    >
     {pending ? "Saving..." : "Save"}
    </button>
   </form>
  </div>
 )
}