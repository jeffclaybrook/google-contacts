"use client"

import { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

type BottomSheetProps = {
 isOpen: boolean
 children: ReactNode
}

export default function BottomSheet({ isOpen, children }: BottomSheetProps) {
 return (
  <AnimatePresence>
   {isOpen && (
    <motion.div
     initial={{ y: "100%" }}
     animate={{ y: 0 }}
     exit={{ y: "100%" }}
     transition={{ type: "spring", stiffness: 300, damping: 30 }}
     className="fixed bottom-0 left-0 right-0 h-screen bg-[#f6fafe] z-50"
    >
     <div className="h-full p-4 py-12 overflow-y-auto">{children}</div>
    </motion.div>
   )}
  </AnimatePresence>
 )
}