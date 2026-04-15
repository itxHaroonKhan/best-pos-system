"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  role: "admin" | "cashier"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/signup"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem("authToken")
    const role = localStorage.getItem("userRole")
    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName")

    if (token && role && userId && userName) {
      setUser({
        id: userId,
        name: userName,
        role: role as "admin" | "cashier",
      })
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect logic
    if (isLoading) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    if (!user && !isPublicRoute) {
      // Not logged in, redirect to login
      router.push("/login")
    } else if (user && pathname === "/") {
      // Logged in, redirect to dashboard if on root
      router.push("/dashboard")
    }
  }, [user, isLoading, pathname, router])

  const login = (token: string, userData: User) => {
    localStorage.setItem("authToken", token)
    localStorage.setItem("userRole", userData.role)
    localStorage.setItem("userId", userData.id)
    localStorage.setItem("userName", userData.name)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    setUser(null)
    router.push("/login")
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
