import type { Contact } from "@/types/contact"
import { getInitial } from "@/lib/get-initial"
import { formatPhoneNumber } from "@/lib/format-phone"

type ContactListProps = {
 contacts: Contact[]
 onContactClick: (contact: Contact) => void
}

export default function ContactsList({ contacts, onContactClick }: ContactListProps) {
 return (
  <ul className="flex flex-col px-2 pb-2 pt-16">
   {contacts.map((contact) => {
    const initial = getInitial(contact.firstName)
    
    return (
     <li
      key={contact.id}
      onClick={() => onContactClick(contact)}
      className="flex items-center gap-4 py-2 cursor-pointer rounded-sm md:hover:bg-[#edf2fc] text-[#1f1f1f] px-2"
     >
      <div className="flex items-center gap-2 max-w-xs w-full">
       <span className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full text-white text-sm" style={{ backgroundColor: contact.avatarColor }}>{initial}</span>
       <h2>{contact.firstName} {contact.lastName}</h2>
      </div>
      <h3 className="hidden md:block flex-1">{formatPhoneNumber(contact.phone)}</h3>
      <h3 className="hidden lg:block flex-1">{contact.email}</h3>
      <h3 className="hidden lg:block flex-1 text-nowrap">{contact.jobTitle}, {contact.company}</h3>
     </li>
    )
   })}
  </ul>
 )
}