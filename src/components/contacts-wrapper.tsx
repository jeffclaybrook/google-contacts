"use client"

import { useState } from "react"
import type { Contact } from "@/types/contact"
import { getInitial } from "@/lib/get-initial"
import { Add, Close } from "./icons"
import BottomSheet from "./bottom-sheet"
import ContactsList from "./contacts-list"
import CreateForm from "./create-form"
import EditForm from "./edit-form"
import EmptyState from "./empty-state"
import SearchBar from "./search-bar"

type ContactsWrapperProps = {
 contacts: Contact[]
}

export default function ContactsWrapper({ contacts: initialContacts }: ContactsWrapperProps) {
 const [contacts, setContacts] = useState<Contact[]>(initialContacts)
 const [filteredContacts, setFilteredContacts] = useState(initialContacts)
 const [isOpen, setIsOpen] = useState<boolean>(false)
 const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

 const handleSearch = (query: string) => {
  const results = contacts.filter((contact) =>
  [contact.firstName, contact.lastName, contact.phone, contact.email, contact.address, contact.company, contact.jobTitle]
   .filter(Boolean)
   .some((field) => field!.toLowerCase().includes(query))
  )
  setFilteredContacts(results)
 }

 const addContact = (newContact: Contact) => {
  const updated = [...contacts, newContact]
  updated.sort((a, b) => {
   const nameA = a.firstName.toLowerCase()
   const nameB = b.firstName.toLowerCase()
   return nameA.localeCompare(nameB)
  })
  setContacts(updated)
  setFilteredContacts(updated)
 }

 const handleContactClick = (contact: Contact) => {
  setSelectedContact(contact)
  setIsOpen(true)
 }

 const handleNewContact = () => {
  setSelectedContact(null)
  setIsOpen(true)
 }

 return (
  <>
   <SearchBar onSearch={handleSearch} />
   {filteredContacts.length === 0 ? (
    <EmptyState />
   ) : (
    <ContactsList contacts={filteredContacts} onContactClick={handleContactClick} />
   )}
   <button
    onClick={handleNewContact}
    aria-label="Create contact"
    className="fixed bottom-6 right-6 inline-flex items-center gap-1 bg-[#c1e8ff] text-[#001e2b] p-4 lg:px-6 rounded-xl shadow-lg cursor-pointer hover:bg-[#c2e7ff] hover:shadow-xl transition"
   >
    <Add />
    <span className="hidden lg:flex">Create</span>
   </button>
   <BottomSheet isOpen={isOpen}>
    {selectedContact ? (
     <>
      <div className="fixed top-0 left-0 w-full flex items-center justify-end p-4">
       <button
        onClick={() => setIsOpen(false)}
        aria-label="Close"
        className="p-2 rounded-full text-[#5f6368] cursor-pointer hover:bg-[#edf2fc]"
       >
        <Close />
       </button>
      </div>
      <div className="flex items-center justify-center">
       <span className="flex items-center justify-center shrink-0 w-20 h-20 rounded-full text-white text-3xl" style={{ backgroundColor: selectedContact.avatarColor }}>{getInitial(selectedContact.firstName)}</span>
      </div>
      <EditForm
       contact={selectedContact}
       onClose={() => setIsOpen(false)}
       onUpdate={(updated) => {
        const updatedContacts = contacts.some(contact => contact.id === updated.id)
         ? contacts.map(contact => contact.id === updated.id ? updated : contact)
         : [updated, ...contacts]
        updatedContacts.sort((a, b) => a.firstName.localeCompare(b.firstName))
        setContacts(updatedContacts)
        setFilteredContacts(updatedContacts)
       }}
       onDelete={(deletedId) => {
        const remaining = contacts.filter((contact) => contact.id !== deletedId)
        setContacts(remaining)
        setFilteredContacts(remaining)
       }}
      />
     </>
    ) : (
     <>
      <div className="fixed top-0 left-0 w-full flex items-center justify-end p-4">
       <button
        onClick={() => setIsOpen(false)}
        aria-label="Close"
        className="p-2 rounded-full text-[#5f6368] cursor-pointer hover:bg-[#edf2fc]"
       >
        <Close />
       </button>
      </div>
      <CreateForm
       onSuccess={() => setIsOpen(false)}
       onContactCreated={(newContact) => addContact(newContact)}
      />
     </>
    )}
   </BottomSheet>
  </>
 )
}