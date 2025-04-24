import { Empty } from "./icons"

export default function EmptyState() {
 return (
  <div className="flex items-center justify-center h-screen">
   <div className="flex flex-col items-center justify-center max-w-2xl mx-auto overflow-hidden">
    <Empty />
    <p className="text-[#1f1f1f] text-center mt-8">You haven&apos;t created any contacts yet!</p>
   </div>
  </div>
 )
}