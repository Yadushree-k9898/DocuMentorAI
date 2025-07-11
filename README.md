# 🧠 DocuMentor AI

**DocuMentor AI** is an intelligent AI-powered document understanding and Q&A assistant that helps users **upload PDFs**, **generate summaries**, and **ask questions** about document content in real time using **Google Gemini** and **Sentence Transformers**.

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen" />
  <img src="https://img.shields.io/badge/AI-Gemini-blue" />
  <img src="https://img.shields.io/badge/vectorstore-FAISS-orange" />
</p>

---

## 🔍 Features

- 📄 **Upload PDF Documents**  
  Securely upload PDF files through the frontend interface.

- ✨ **Automatic Summarization**  
  Generates concise and informative summaries using **Gemini** on upload.

- 💬 **Ask Questions**  
  Ask natural-language questions about your uploaded documents. Answers are generated using both:
  - Vector similarity search (via FAISS & SentenceTransformers)
  - Gemini LLM for intelligent, contextual answers

- 🧠 **Semantic Vector Embeddings**  
  Uses `all-MiniLM-L6-v2` to embed document chunks and user queries.

- ⚡ **Fast & Accurate Retrieval**  
  FAISS enables rapid top-k chunk retrieval for better Q&A grounding.

- 📚 **Document Dashboard**  
  Interactive frontend built with **Next.js + Tailwind CSS**, allowing:
  - Document browsing
  - Real-time Q&A interface
  - Summary viewing
  - Search & filter

---

## 🏗️ Tech Stack

| Layer        | Technology                            |
|--------------|----------------------------------------|
| 🧠 AI Models  | Google Gemini, SentenceTransformers    |
| 📦 Vector DB | FAISS (FlatL2 index)                   |
| 🐍 Backend   | FastAPI, SQLAlchemy, PostgreSQL        |
| 💻 Frontend  | Next.js, Tailwind CSS, Framer Motion   |
| 🔐 Auth      | JWT-based authentication (Login/Register) |
| ☁️ Hosting   | Hugging Face Spaces (for backend), Vercel (frontend optional) |

---

## 🚀 Demo

> 🔗 Live on Hugging Face Spaces:  
**https://huggingface.co/spaces/yadushree2002/documentor-ai**

> 🌐 Frontend (connects to API above):  
Replace with your deployed frontend URL (e.g. Vercel)

---

## 🛠️ Setup Instructions

### 1. Backend (FastAPI)

```bash
# Clone the repo
git clone https://github.com/yourusername/documentor-ai
cd documentor-ai/backend

# Install dependencies
pip install -r requirements.txt

# Create .env
cp .env.example .env
# Fill in your GEMINI_API_KEY and DB_URL

# Run the server
uvicorn app.main:app --reload
