"use client"
import { useEffect, useState, useCallback, lazy, Suspense, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Upload, LogOut, FileText, Search, Filter } from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import api from "../../lib/api"

const DocumentCard = lazy(() => import("../../components/DocumentCard"))

export default function DashboardPage() {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const logout = useAuthStore((state) => state.logout)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documents
    return documents.filter(
      (doc) =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.summary_preview?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [documents, searchTerm])
  const handleDelete = useCallback(async (docId) => {
    const confirmed = window.confirm("Are you sure you want to delete this document and its chat history?")
    if (!confirmed) return

    try {
      const res = await api.delete(`/documents/${docId}`)
      if (res.status === 204) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== docId))
      } else {
        alert("❌ Failed to delete document.")
      }
    } catch (err) {
      console.error("❌ Delete error:", err?.response?.data || err.message)
      alert("Failed to delete document.")
    }
  }, [])

  useEffect(() => {
    if (hasHydrated && !token) {
      router.push("/login")
    }
  }, [hasHydrated, token, router])

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get("/documents/documents")
        setDocuments(res.data)
      } catch (err) {
        console.error("[❌] Failed to fetch docs:", err?.response?.data || err.message)
        setError("Failed to fetch documents.")
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchDocs()
  }, [token])

  if (!token) return null

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-orange-600/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Your Document Library
            </h1>
            <p className="text-muted-foreground text-lg">Manage and interact with your uploaded documents</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              onClick={() => router.push("/documents/upload")}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 bg-background/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:bg-background"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <Card className="border-destructive/50 bg-destructive/5 max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="text-destructive text-lg font-semibold mb-2">{error}</div>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : filteredDocuments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <Card className="border-0 bg-background/50 backdrop-blur-sm shadow-xl max-w-md mx-auto">
              <CardContent className="p-12">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{searchTerm ? "No documents found" : "No documents yet"}</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? `No documents match "${searchTerm}". Try a different search term.`
                    : "Upload your first PDF to get started with AI-powered document analysis."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => router.push("/documents/upload")}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Your First Document
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-0 bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-muted rounded w-full mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <DocumentCard
                    id={doc.id}
                    title={doc.filename.split("_").slice(1).join("_") || doc.filename}
                    summary={doc.summary_preview}
                    uploadedAt={doc.created_at}
                    onDelete={() => handleDelete(doc.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </Suspense>
        )}
      </div>
    </div>
  )
}
