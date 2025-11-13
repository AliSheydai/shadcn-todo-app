"use client"

import { useEffect, useState, useCallback } from "react"

// useTheme: centralizes theme (dark/light) handling and guards access to localStorage
export default function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      return (typeof window !== "undefined" && localStorage.getItem("theme") === "dark") || false
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    if (typeof document === "undefined") return

    try {
      if (dark) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
    } catch (e) {
      // ignore storage errors (private mode / blocked cookies)
    }
  }, [dark])

  const toggle = useCallback(() => setDark((d) => !d), [])

  return { dark, setDark, toggle }
}
