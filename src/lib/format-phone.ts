export function formatPhoneNumber(phone: string): string {
 const digits = phone.replace(/\D/g, "")
 if (digits.length !== 10) return phone
 const area = digits.slice(0, 3)
 const middle = digits.slice(3, 6)
 const last = digits.slice(6)
 return `(${area}) ${middle}-${last}`
}

export function formatPhoneInput(value: string): string {
 const digits = value.replace(/\D/g, "").slice(0, 10) // only digits, max 10
 const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
 if (!match) return value
 let formatted = ""
 if (match[1]) formatted += `(${match[1]}`
 if (match[2]) formatted += match[2].length === 3 ? `) ${match[2]}` : match[2]
 if (match[3]) formatted += `-${match[3]}`
 return formatted
}