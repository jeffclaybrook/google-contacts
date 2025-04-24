"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Delete } from "./icons"

type ConfirmDialogProps = {
 isOpen: boolean
 onCancel: () => void
 onConfirm: () => void
 title?: string
}

export default function ConfirmDialog({ isOpen, onCancel, onConfirm, title }: ConfirmDialogProps) {
 return (
  <AnimatePresence>
   {isOpen && (
    <>
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
     >
      <div className="bg-[#f6fafe] rounded-lg p-6 max-w-sm w-full shadow-lg">
       <h2 className="text-[#1f1f1f] text-lg mb-2">{title}</h2>
       <div className="flex items-center justify-end">
        <button
         onClick={onCancel}
         aria-label="Cancel"
         className="text-gray-500 cursor-pointer transition hover:text-gray-700 py-3 px-4"
        >
         Cancel
        </button>
        <button
         onClick={onConfirm}
         aria-label="Delete contact"
         className="inline-flex items-center justify-center gap-1 text-red-500 py-3 px-4 cursor-pointer transition hover:text-red-700"
        >
         <Delete />
         Delete
        </button>
       </div>
      </div>
     </motion.div>
    </>
   )}
  </AnimatePresence>
 )
}