'use client'

import { ThemeProvider } from '../components/theme-provider'
import { AuthProvider } from '../context/AuthContext'
import '../styles/global.css'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider>
          <Navbar />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
