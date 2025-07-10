"use client"
import { useEffect, useState, useMemo, lazy, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, FileText, Calendar, Brain, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import api from "../../../lib/api"
import { useAuthStore } from "../../../store/authStore"
import { ENDPOINTS } from "../../../constants/endpoints";


const ChatBox = lazy(() => import("../../../components/ChatBox"))

export default function DocumentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (hasHydrated && !token) {
      router.push("/login")
    }
  }, [hasHydrated, token, router])

  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await api.get(ENDPOINTS.DOCUMENTS.DETAIL(id))
        
        

        setDocument(res.data)
      } catch (err) {
        console.error("[❌] Failed to fetch document:", err)
        setError("Failed to load document.")
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchDocument()
  }, [id, token])

  const parsedText = useMemo(() => {
    if (!document?.text) return []
    if (Array.isArray(document.text)) return document.text
    try {
      return JSON.parse(document.text)
    } catch {
      return []
    }
  }, [document])

  if (!token) return null

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="border-destructive/50 bg-destructive/5 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-destructive text-lg font-semibold mb-2">{error}</div>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!document) return null

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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {document.filename.split("_").slice(1).join("_") || document.filename}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Uploaded{" "}
                    {new Date(document.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Badge variant="secondary">PDF Document</Badge>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 bg-background/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Summary
                  </CardTitle>
                  <CardDescription>Intelligent summary generated from document content</CardDescription>
                </CardHeader>
                <CardContent>
                  {document.summary ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="text-foreground leading-relaxed whitespace-pre-line">{document.summary}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No summary generated yet.</p>
                      <p className="text-sm">Summary will be available after processing.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Document Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 bg-background/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Extracted Text
                  </CardTitle>
                  <CardDescription>Full text content extracted from your document</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {parsedText.length > 0 ? (
                    parsedText.map((chunk, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="border border-border/50 rounded-lg p-4 bg-background/30"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            Page {chunk.page_number ?? idx + 1}
                          </Badge>
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <p className="text-foreground leading-relaxed whitespace-pre-line text-sm">{chunk.content}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No extracted text found.</p>
                      <p className="text-sm">Text extraction may still be in progress.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-6"
            >
              <Card className="border-0 bg-background/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Chat with Document
                  </CardTitle>
                  <CardDescription>Ask questions about your document content</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Suspense
                    fallback={
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    }
                  >
                    <ChatBox docId={document.id} />
                  </Suspense>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
