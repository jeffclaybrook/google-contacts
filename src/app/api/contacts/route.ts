import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { decrypt, encrypt } from "@/lib/encryption"
import { generateColor } from "@/lib/generate-color"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const { firstName, lastName, phone, email, address, company, jobTitle } = await req.json()

 try {
  const newContact = await prisma.contact.create({
   data: {
    userId,
    firstName: encrypt(firstName),
    lastName: encrypt(lastName),
    phone: encrypt(phone),
    email: encrypt(email),
    address: encrypt(address),
    company: company ? encrypt(company) : null,
    jobTitle: jobTitle ? encrypt(jobTitle) : null,
    avatarColor: generateColor()
   }
  })

  const decrypted = {
   ...newContact,
   firstName: decrypt(newContact.firstName),
   lastName: decrypt(newContact.lastName),
   phone: decrypt(newContact.phone),
   email: decrypt(newContact.email),
   address: decrypt(newContact.address),
   company: newContact.company ? decrypt(newContact.company) : null,
   jobTitle: newContact.jobTitle ? decrypt(newContact.jobTitle) : null
  }

  return NextResponse.json(decrypted)
 } catch (error) {
  console.error("Error creating contact:", error)
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
 }
}