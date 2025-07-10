"use client"
import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SummaryBlock({ summary }) {
  if (!summary) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-0 bg-gradient-to-br from-primary/5 via-background to-purple-600/5 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            AI Generated Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-foreground leading-relaxed whitespace-pre-line">{summary}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
