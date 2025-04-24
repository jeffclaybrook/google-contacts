"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import { useFormStatus } from "react-dom"
import type { Contact } from "@/types/contact"
import { formatPhoneInput } from "@/lib/format-phone"
import { Delete } from "./icons"
import { useToast } from "./toast-provider"
import AddressAutocomplete from "./address-autocomplete"
import ConfirmDialog from "./confirm-dialog"

type EditFormProps = {
 contact: Contact
 onClose: () => void
 onUpdate: (updated: Contact) => void
 onDelete: (deletedId: string) => void
}

export default function EditForm({ contact, onClose, onUpdate, onDelete }: EditFormProps) {
 const [form, setForm] = useState({ ...contact })
 const [loading, setLoading] = useState<boolean>(false)
 const [showConfirm, setShowConfirm] = useState<boolean>(false)
 const { pending } = useFormStatus()

 const { showToast, dismissToast } = useToast()

 const deletedContact = contact

 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value })
 }

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setLoading(true)
  onClose()

  try {
   const res = await fetch(`/api/contacts/${contact.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
   })

   if (res.ok) {
    const updated = await res.json()
    onUpdate(updated)
    showToast({
     message: "Contact successfully updated!",
     type: "success"
    })
   } else {
    console.error("Failed to update contact")
   }
  } catch(error) {
   console.error("Error updating contact:", error)
  }

  setLoading(false)
 }

 const handleDelete = async () => {
  onDelete(contact.id)
  onClose()
  setShowConfirm(false)
  const toastId = showToast({
   message: "Contact successfully deleted!",
   type: "success",
   actionLabel: "Undo",
   onAction: () => {
    onUpdate(deletedContact)
    dismissToast(toastId)
   }
  })

  try {
   const res = await fetch(`/api/contacts/${contact.id}`, {
    method: "DELETE"
   })

   if (!res.ok) {
    console.error("Unable to delete contact")
   }
  } catch (error) {
   console.error("Network error during delete:", error)
  }
 }

 return (
  <>
   <div className="max-w-md w-full mx-auto pt-4">
    <h2 className="text-[#1f1f1f] text-2xl text-center mb-6">Edit Contact</h2>
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
       onChange={(e) => {
        setForm((prev) => ({
         ...prev,
         phone: formatPhoneInput(e.target.value)
        }))
       }}
       placeholder=" "
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
       value={form.company || ""}
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
       value={form.jobTitle || ""}
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
      aria-label="Edit contact"
      disabled={pending || loading}
      className="py-3 px-4 rounded-full bg-[#176684] text-white cursor-pointer"
     >
      {pending || loading ? "Updating..." : "Update"}
     </button>
     <button
      type="button"
      onClick={() => setShowConfirm(true)}
      aria-label="Delete contact"
      className="inline-flex items-center justify-center gap-1 text-red-500 py-3 px-4 cursor-pointer transition hover:text-red-700"
     >
      <Delete />
      Delete
     </button>
    </form>
   </div>
   <ConfirmDialog
    isOpen={showConfirm}
    onCancel={() => setShowConfirm(false)}
    onConfirm={handleDelete}
    title={`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`}
   />
  </>
 )
}