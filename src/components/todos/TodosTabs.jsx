"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListChecks, CircleDashed, Loader2, CheckCircle2 } from "lucide-react"

export default function TodosTabs({ value = "all", onValueChange = () => {}, className = "mb-8 bg-white rounded-xl" }) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList className="dark:bg-gradient-to-r dark:from-[#282440] dark:to-[#5F278B]">
        <TabsTrigger className="bg-white dark:bg-[#64318C] shadow mr-10 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:to-[#9134EA] data-[state=active]:from-[#2A60EB] data-[state=active]:text-white hover:scale-110" value="all"><ListChecks className="mr-2" /> All</TabsTrigger>
        <TabsTrigger className="bg-white dark:bg-[#64318C] shadow mr-10 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:to-[#9134EA] data-[state=active]:from-[#2A60EB] data-[state=active]:text-white hover:scale-110" value="todo"><CircleDashed className="mr-2" /> Todo</TabsTrigger>
        <TabsTrigger className="bg-white dark:bg-[#64318C] shadow mr-10 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:to-[#9134EA] data-[state=active]:from-[#2A60EB] data-[state=active]:text-white hover:scale-110" value="inprogress"><Loader2 className="mr-2" /> In Progress</TabsTrigger>
        <TabsTrigger className="bg-white dark:bg-[#64318C] shadow cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:to-[#9134EA] data-[state=active]:from-[#2A60EB] data-[state=active]:text-white hover:scale-110" value="done"><CheckCircle2 className="mr-2" /> Done</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
