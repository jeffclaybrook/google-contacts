"use client"

import { createContext, ReactNode, useContext, useState } from "react"
import clsx from "clsx"

type ToastType = "success" | "error"

type Toast = {
 id: string
 message: string
 type?: ToastType
 actionLabel?: string
 onAction?: () => void
}

type ToastContextType = {
 showToast: (toast: Omit<Toast, "id">) => string
 dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
 const context = useContext(ToastContext)
 if (!context) throw new Error("useToast must be used inside a ToastProvider")
 return context
}

export default function ToastProvider({ children }: { children: ReactNode }) {
 const [toasts, setToasts] = useState<Toast[]>([])

 const dismissToast = (id: string) => {
  setToasts((prev) => prev.filter((toast) => toast.id !== id))
 }

 const showToast = (toast: Omit<Toast, "id">) => {
  const id = crypto.randomUUID()
  setToasts((prev) => [...prev, { ...toast, id }])
  setTimeout(() => dismissToast(id), 5000)
  return id
 }

 return (
  <ToastContext.Provider value={{ showToast, dismissToast }}>
   {children}
   <div className="fixed bottom-6 left-1/2 -translate-x-1/2 space-y-3 z-50">
    {toasts.map((toast) => (
     <div
      key={toast.id}
      className={clsx(
       "flex items-center justify-between gap-4 max-w-md w-full p-4 rounded-lg shadow-lg text-white transition-all",
       toast.type === "error" ? "bg-red-500" : "bg-green-700"
      )}
     >
      <span className="text-sm">{toast.message}</span>
      {toast.actionLabel && toast.onAction && (
       <button
        onClick={() => {
         toast.onAction?.()
         dismissToast(toast.id)
        }}
        className="text-sm underline text-white hover:text-gray-200 cursor-pointer"
       >
        {toast.actionLabel}
       </button>
      )}
     </div>
    ))}
   </div>
  </ToastContext.Provider>
 )
}