'use client'

import { AuthProvider } from '../context/AuthContext'
import '../styles/global.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
