"use client"
import { motion } from "framer-motion"
import { User, Bot } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "../lib/utils"

export default function MessageBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex items-start gap-3 max-w-[80%]", isUser ? "flex-row-reverse" : "flex-row")}>
        {/* Avatar */}
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            isUser ? "bg-primary/10" : "bg-gradient-to-br from-primary/20 to-purple-600/20",
          )}
        >
          {isUser ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-primary" />}
        </div>

        {/* Message */}
        <Card className={cn("shadow-sm", isUser ? "bg-primary text-primary-foreground" : "bg-muted/50")}>
          <CardContent className="p-3">
            <p className="text-sm leading-relaxed whitespace-pre-line">{message}</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
