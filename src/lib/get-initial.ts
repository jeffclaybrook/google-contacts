export function getInitial(name: string): string {
 if (!name) return ""
 return name.trim().charAt(0).toUpperCase()
}