"use client"
import { useRouter } from "next/navigation"
import { ArrowRight, Upload, Brain, MessageCircle, Sparkles, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()

  const features = [
    {
      icon: Upload,
      title: "Smart Upload",
      description: "Drag & drop PDFs with intelligent processing and instant text extraction.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "AI Summarization",
      description: "Generate comprehensive summaries using advanced AI models in seconds.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: MessageCircle,
      title: "Interactive Chat",
      description: "Ask questions and get instant answers from your documents with context.",
      color: "from-green-500 to-emerald-500",
    },
  ]

  const stats = [
    { number: "10K+", label: "Documents Processed" },
    { number: "99.9%", label: "Accuracy Rate" },
    { number: "< 2s", label: "Response Time" },
    { number: "24/7", label: "Available" },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                DocuMentor AI
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform how you interact with documents. Upload, analyze, and chat with your PDFs using cutting-edge AI
              technology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Button
              onClick={() => router.push("/register")}
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>

            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300 group"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Document Intelligence
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of document processing with our AI-powered platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background/50 to-background/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 card-hover group">
                  <CardContent className="p-8">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm shadow-2xl overflow-hidden">
            <CardContent className="p-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary to-purple-600">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Document Workflow?</h2>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust DocuMentor AI for intelligent document processing and analysis.
              </p>

              <Button
                onClick={() => router.push("/register")}
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
