import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { decrypt, encrypt } from "@/lib/encryption"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const url = new URL(req.url)
 const id = url.pathname.split("/").pop()

 if (!id) {
  return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 })
 }

 const contact = await prisma.contact.findUnique({
  where: { id }
 })

 if (!contact || contact.userId !== userId) {
  return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
 }

 const decrypted = {
  ...contact,
  firstName: decrypt(contact.firstName),
  lastName: decrypt(contact.lastName),
  phone: decrypt(contact.phone),
  email: decrypt(contact.email),
  address: decrypt(contact.address),
  company: contact.company ? decrypt(contact.company) : null,
  jobTitle: contact.jobTitle ? decrypt(contact.jobTitle) : null
 }

 return NextResponse.json(decrypted)
}

export async function PUT(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const url = new URL(req.url)
 const id = url.pathname.split("/").pop()

 if (!id) {
  return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 })
 } 

 const { firstName, lastName, phone, email, address, company, jobTitle } = await req.json()

 const updated = await prisma.contact.updateMany({
  where: { id, userId },
  data: {
   firstName: encrypt(firstName),
   lastName: encrypt(lastName),
   phone: encrypt(phone),
   email: encrypt(email),
   address: encrypt(address),
   company: company ? encrypt(company) : null,
   jobTitle: jobTitle ? encrypt(jobTitle) : null
  }
 })

 if (updated.count === 0) {
  return NextResponse.json({ error: "Contact not found or unauthorized" }, { status: 404 })
 }

 const contact = await prisma.contact.findUnique({ where: { id } })

 if (!contact) {
  return NextResponse.json({ error: "Contact not found after update" }, { status: 404 })
 }

 const decrypted = {
  ...contact,
  firstName: decrypt(contact.firstName),
  lastName: decrypt(contact.lastName),
  phone: decrypt(contact.phone),
  email: decrypt(contact.email),
  address: decrypt(contact.address),
  company: contact.company ? decrypt(contact.company) : null,
  jobTitle: contact.jobTitle ? decrypt(contact.jobTitle) : null
 }

 return NextResponse.json(decrypted)
}

export async function DELETE(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const url = new URL(req.url)
 const id = url.pathname.split("/").pop()

 if (!id) {
  return NextResponse.json({ error: "Invalid contact ID" }, { status: 400 })
 }

 const contact = await prisma.contact.findUnique({
  where: { id }
 })

 if (!contact || contact.userId !== userId) {
  return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
 }

 await prisma.contact.delete({ where: { id } })

 return NextResponse.json({ success: true })
}