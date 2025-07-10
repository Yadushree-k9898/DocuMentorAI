"use client"
import { useState, useEffect, useCallback, lazy, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Trash2, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuthStore } from "../store/authStore"

const MessageBubble = lazy(() => import("./MessageBubble"))

export default function ChatBox({ docId }) {
  const token = useAuthStore((state) => state.token)
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const inputRef = useRef()
  const scrollRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history, loading])

  // Load chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/v1/qa/${docId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const text = await res.text()
        const data = JSON.parse(text)
        if (Array.isArray(data)) {
          setHistory(data)
        } else {
          console.warn("[⚠️] Invalid chat history:", data)
        }
      } catch (err) {
        console.error("[❌] Fetch history failed:", err.message || err)
      }
    }

    if (token) fetchHistory()
  }, [docId, token])

  const askQuestion = useCallback(async () => {
    if (!question.trim() || loading) return

    const currentQuestion = question
    setQuestion("")
    setLoading(true)

    // Add user message immediately
    setHistory((prev) => [...prev, { question: currentQuestion, answer: null }])

    try {
      const res = await fetch(`/api/v1/qa/${docId}/ask?question=${encodeURIComponent(currentQuestion)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const text = await res.text()
      const data = JSON.parse(text)
      const reply = data?.answer || data?.detail || "⚠️ No valid response from server."

      // Update the last message with the answer
      setHistory((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].answer = reply
        return updated
      })
    } catch (err) {
      console.error("[❌] Ask failed:", err.message || err)
      setHistory((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].answer = err.message || "❌ Failed to get answer."
        return updated
      })
    } finally {
      setLoading(false)
    }
  }, [question, loading, docId, token])

  const clearHistory = useCallback(async () => {
    if (!confirm("Are you sure you want to clear the chat history?")) return

    try {
      await fetch(`/api/v1/qa/${docId}/history`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setHistory([])
    } catch (err) {
      console.error("[❌] Clear history failed:", err.message || err)
    }
  }, [docId, token])

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        askQuestion()
      }
    },
    [askQuestion],
  )

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-medium">AI Assistant</span>
        </div>
        {history.length > 0 && (
          <Button
            onClick={clearHistory}
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {history.length === 0 && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-2">Start a conversation with your document</p>
              <p className="text-sm text-muted-foreground/70">
                Ask questions about the content, request summaries, or explore key insights
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {history.map((entry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <Card className="bg-primary text-primary-foreground">
                      <CardContent className="p-3">
                        <p className="text-sm">{entry.question}</p>
                      </CardContent>
                    </Card>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>

                {/* AI Response */}
                {entry.answer !== null && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <Card className="bg-muted/50">
                        <CardContent className="p-3">
                          <p className="text-sm leading-relaxed whitespace-pre-line">{entry.answer}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI is thinking...
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask a question about this document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1 bg-background/50 border-border/50 focus:bg-background"
          />
          <Button
            onClick={askQuestion}
            disabled={loading || !question.trim()}
            size="icon"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
