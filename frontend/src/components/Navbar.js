"use client"
import Link from "next/link"
import { useMemo } from "react"
import { useAuthStore } from "../store/authStore"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "../components/mode-toggle"
import { LogOut, Upload, LayoutDashboard, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function Navbar() {
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const isLoggedIn = useMemo(() => !!token, [token])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="relative">
            <Sparkles className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 h-8 w-8 text-primary animate-pulse-glow rounded-full" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            DocuMentor AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ModeToggle />

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="default" asChild className="hidden sm:flex min-w-[100px] h-10">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <Button variant="ghost" size="default" asChild className="hidden sm:flex min-w-[90px] h-10">
                <Link href="/documents/upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </Link>
              </Button>

              <Button
                onClick={logout}
                variant="destructive"
                size="default"
                className="flex items-center gap-2 min-w-[80px] h-10 sm:min-w-[90px]"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="default" asChild className="min-w-[70px] h-10">
                <Link href="/login">Login</Link>
              </Button>
              <Button
                size="default"
                asChild
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 min-w-[80px] h-10 font-medium"
              >
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
