"use client"
import { useState, useCallback, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import api from "../../../lib/api"
import { useAuthStore } from "../../../store/authStore"

export default function UploadPage() {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token, router])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile.type === "application/pdf") {
          setFile(droppedFile)
          if (!title) {
            setTitle(droppedFile.name.replace(".pdf", ""))
          }
        } else {
          setError("Please upload a PDF file only.")
        }
      }
    },
    [title],
  )

  const handleFileChange = useCallback(
    (e) => {
      const selectedFile = e.target.files[0]
      if (selectedFile) {
        setFile(selectedFile)
        if (!title) {
          setTitle(selectedFile.name.replace(".pdf", ""))
        }
      }
    },
    [title],
  )

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setError("")
      setLoading(true)
      setUploadProgress(0)

      if (!title || !file) {
        setError("Please provide both title and file.")
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("title", title)
      formData.append("file", file)

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 200)

        await api.post("/documents/upload-pdf", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        setUploadProgress(100)
        clearInterval(progressInterval)

        setTimeout(() => {
          startTransition(() => {
            router.push("/dashboard")
          })
        }, 500)
      } catch (err) {
        console.error("[❌] Upload error:", err)
        setError("❌ Failed to upload document.")
        setUploadProgress(0)
      } finally {
        setLoading(false)
      }
    },
    [title, file, router],
  )

  if (!token) return null

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-orange-600/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
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

          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Upload Document
          </h1>
          <p className="text-muted-foreground text-lg">Upload a PDF document to start analyzing with AI</p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Upload Your Document</CardTitle>
              <CardDescription className="text-base">Drag and drop your PDF or click to browse</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Document Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter document title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-12 bg-background/50 border-border/50 focus:bg-background transition-all duration-200"
                  />
                </div>

                {/* File Upload Area */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">PDF File</Label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-primary bg-primary/5 scale-105"
                        : file
                          ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />

                    {file ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-700 dark:text-green-400">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            setFile(null)
                          }}
                        >
                          Change File
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">Drop your PDF here, or click to browse</p>
                          <p className="text-sm text-muted-foreground">Maximum file size: 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading document...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </motion.div>
                )}

                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || isPending || !file || !title}
                  className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
                >
                  {loading || isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {uploadProgress < 100 ? "Uploading..." : "Processing..."}
                    </div>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </form>

              {/* Upload Tips */}
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Upload Tips
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Only PDF files are supported</li>
                  <li>• Maximum file size is 10MB</li>
                  <li>• Clear, high-quality scans work best</li>
                  <li>• Processing typically takes 10-30 seconds</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

