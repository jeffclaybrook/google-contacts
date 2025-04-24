import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { decrypt } from "@/lib/encryption"
import prisma from "@/lib/prisma"
import ContactsWrapper from "@/components/contacts-wrapper"

export default async function Contacts() {
 const { userId } = await auth()

 if (!userId) {
  return redirect("/sign-in")
 }

 const contacts = await prisma.contact.findMany({
  orderBy: { firstName: "asc" }
 })

 const decryptedContacts = contacts.map((contact) => ({
  ...contact,
  firstName: decrypt(contact.firstName),
  lastName: decrypt(contact.lastName),
  phone: decrypt(contact.phone),
  email: decrypt(contact.email),
  address: decrypt(contact.address),
  company: contact.company ? decrypt(contact.company) : null,
  jobTitle: contact.jobTitle ? decrypt(contact.jobTitle) : null
 }))

 return (
  <>
   <ContactsWrapper contacts={decryptedContacts} />
  </>
 )
}