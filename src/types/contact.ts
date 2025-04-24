export type Contact = {
 id: string
 userId: string | null
 firstName: string
 lastName: string
 phone: string
 email: string
 address: string
 company?: string | null
 jobTitle?: string | null
 avatarColor: string
}