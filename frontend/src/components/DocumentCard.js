"use client"
import { memo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Trash2, FileText, Calendar, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const DocumentCard = ({ id, title, summary, uploadedAt, onDelete }) => {
  const router = useRouter()

  const handleView = useCallback(() => {
    router.push(`/documents/${id}`)
  }, [router, id])

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation()
      onDelete?.()
    },
    [onDelete],
  )

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="relative overflow-hidden border-0 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 card-hover group cursor-pointer">
        <CardContent className="p-6" onClick={handleView}>
          {/* Delete Button */}
          <Button
            onClick={handleDelete}
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Document Icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 group-hover:from-primary/30 group-hover:to-purple-600/30 transition-all duration-300">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {title}
              </h3>
              <Badge variant="secondary" className="text-xs">
                PDF Document
              </Badge>
            </div>
          </div>

          {/* Summary */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {summary || "No summary available yet. Click to view and generate summary."}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(uploadedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="text-primary hover:text-primary/80 hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation()
                handleView()
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>

          {/* Hover Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default memo(DocumentCard)
