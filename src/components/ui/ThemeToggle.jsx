"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import useTheme from "@/lib/useTheme"

export default function ThemeToggle({ className = "" }) {
  const { dark, toggle } = useTheme()

  return (
    <Button onClick={toggle} className={className}>
      {dark ? <Sun /> : <Moon />}
      {dark ? "Light" : "Dark"}
    </Button>
  )
}
