"use client"

import React from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * Simple TodoCard component. Keep it minimal so it can be used across pages.
 * Props:
 * - todo: todo object
 * - onEdit: function to call with todo when user clicks Edit
 * - onDelete: function to call with todo id when user clicks Delete
 * - prefetch: optional prefetch function called on mouse enter
 */
export default function TodoCard({ todo, prefetch, actions = null }) {
  return (
    <Link key={todo.id} href={`/todos/${todo.id}`} onMouseEnter={() => prefetch && prefetch(todo.id)}>
      <Card className="shadow-lg h-50 border border-gray-200/20 dark:border-gray-700/40 bg-white/60 dark:bg-[#453063]/30 backdrop-blur-md group relative hover:scale-105 transition-all duration-300 dark:shadow-xl dark:hover:shadow-[#d034ff] hover:shadow-gray-200/40 hover:border-gray-300/90 cursor-pointer rounded-xl">
        <div className="p-3 space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{todo.title}</h3>
            <div className={`px-2 py-1 text-xs rounded-md text-white font-medium ${todo.priority === "high" ? "bg-red-600" : todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
              {todo.priority || "low"}
            </div>
          </div>

          <p className="text-gray-700 font-medium text-xs dark:text-gray-300">{todo.description || "No description"}</p>

          <div className={`absolute left-5 bottom-2 px-2 py-1 w-fit mb-4 text-xs rounded-md text-white font-medium bg-gradient-to-r ${todo.status === "todo" ? "from-[#3D80F5] to-[#6268F2]" : todo.status === "inprogress" ? "from-[#A755F7] to-[#8D5BF6]" : "from-[#1FC363] to-[#11B97F] text-white"}`}> {todo.status || "todo"}</div>

          {/* Action area: caller can inject custom dialogs/buttons here to preserve existing behavior */}
          <div className="absolute right-5 bottom-5 flex gap-2 mt-2 md:opacity-0 md:group-hover:opacity-100 md:translate-y-5 md:group-hover:translate-y-0 md:group-hover:flex transition-all duration-300">
            {actions}
          </div>
        </div>
      </Card>
    </Link>
  )
}
