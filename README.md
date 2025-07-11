# 📜 DocuMentor AI

<div align="center">
  <h3>🚀 Intelligent Document Understanding & Q&A Assistant</h3>
  <p>Upload PDFs, generate summaries, and ask questions about document content in real-time using Google Gemini and Sentence Transformers</p>
  
  <p>
    <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status" />
    <img src="https://img.shields.io/badge/AI-Gemini-blue" alt="AI Model" />
    <img src="https://img.shields.io/badge/vectorstore-FAISS-orange" alt="Vector Store" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>
  
  <p>
    <a href="#demo">🔗 Live Demo</a> •
    <a href="#features">✨ Features</a> •
    <a href="#setup">🛠️ Setup</a> •
    <a href="#usage">📖 Usage</a>
  </p>
</div>

---

## 🎯 What is DocuMentor AI?

DocuMentor AI is a powerful document intelligence platform that transforms how you interact with your documents. Simply upload a PDF, and our AI will understand, summarize, and answer questions about its content with remarkable accuracy.

### 🌟 Key Highlights
- **🤖 AI-Powered**: Leverages Google Gemini for intelligent responses
- **⚡ Lightning Fast**: FAISS vector search for instant document retrieval
- **🎨 Beautiful UI**: Modern Next.js interface with smooth animations
- **🔒 Secure**: JWT-based authentication and secure file handling
- **📱 Responsive**: Works seamlessly across all devices

---

## 🔍 Features

### 📄 **Smart Document Upload**
- Drag & drop PDF upload with progress tracking
- Automatic text extraction and processing
- Support for multi-page documents

### ✨ **AI-Powered Summarization**
- Generates concise, informative summaries instantly
- Powered by Google Gemini for superior quality
- Customizable summary length and focus

### 💬 **Natural Language Q&A**
- Ask questions in plain English
- Get contextually accurate answers
- Combines vector similarity search with LLM intelligence
- Real-time response generation

### 🧠 **Advanced Vector Search**
- Uses `all-MiniLM-L6-v2` for semantic embeddings
- FAISS FlatL2 index for ultra-fast retrieval
- Intelligent chunk selection for better context

### 📊 **Interactive Dashboard**
- Browse all uploaded documents
- View summaries and ask questions
- Search and filter documents
- Clean, intuitive interface

---

## 🏗️ Architecture

<div align="center">

| Component | Technology | Purpose |
|-----------|------------|---------|
| 🧠 **AI Engine** | Google Gemini + SentenceTransformers | Document understanding & Q&A |
| 📦 **Vector Store** | FAISS (FlatL2) | Fast semantic search |
| 🐍 **Backend** | FastAPI + SQLAlchemy | API & data management |
| 💾 **Database** | PostgreSQL | Document metadata storage |
| 💻 **Frontend** | Next.js + Tailwind CSS | User interface |
| 🎨 **UI/UX** | Framer Motion | Smooth animations |
| 🔐 **Security** | JWT Authentication | User management |
| ☁️ **Hosting** | Hugging Face Spaces + Vercel | Deployment |

</div>

---

## 🚀 Demo

<div align="center">
  
**🔗 Live Application**
  
[![Hugging Face Spaces](https://img.shields.io/badge/🤗-Hugging%20Face%20Spaces-yellow)](https://huggingface.co/spaces/yadushree2002/documentor-ai)

*Try DocuMentor AI now - No installation required!*

</div>

---

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Google Gemini API Key

### 🐍 Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/documenter-ai.git
cd documenter-ai/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials:
# GEMINI_API_KEY=your_gemini_api_key
# DATABASE_URL=postgresql://user:password@localhost/documenter_db
# JWT_SECRET=your_jwt_secret

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 💻 Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Your application will be available at:
- **Frontend**: [DocuMentorAi-Frontend](https://docu-mentor-ai.vercel.app/)
- **Backend API**: [DocuMentorAi-Backend](https://huggingface.co/spaces/yadushree2002/documentor-ai)


---

## 📖 Usage

### 1. **Upload Documents**
```bash
# Via UI: Drag & drop PDF files
# Via API: POST /documents/upload
curl -X POST "http://localhost:8000/documents/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"
```

### 2. **Generate Summaries**
```bash
# Automatic on upload, or manually trigger
curl -X POST "http://localhost:8000/documents/{doc_id}/summarize" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. **Ask Questions**
```bash
# Ask natural language questions
curl -X POST "http://localhost:8000/documents/{doc_id}/ask" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the main points discussed?"}'
```

---

## 📂 Project Structure

```
documenter-ai/
├── 🐍 backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── routes/          # FastAPI routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── main.py          # FastAPI application
│   ├── vector_store/        # FAISS indices
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
├── 💻 frontend/
│   ├── components/          # React components
│   ├── pages/               # Next.js pages
│   ├── store/               # State management
│   ├── lib/                 # Utilities
│   ├── styles/              # CSS & Tailwind
│   └── package.json         # Node dependencies
├── 📚 docs/                 # Documentation
├── 🧪 tests/                # Test files
├── README.md                # This file
└── LICENSE                  # MIT License
```

---

## 🌟 Use Cases

| Industry | Use Case | Benefits |
|----------|----------|----------|
| ⚖️ **Legal** | Contract & Document Review | Fast analysis, key point extraction |
| 🎓 **Academic** | Research Paper Summarization | Quick literature reviews, insights |
| 📚 **Education** | Textbook Q&A | Interactive learning, concept clarification |
| 💼 **Business** | Meeting Notes & Reports | Action items, decision tracking |
| 🏥 **Healthcare** | Medical Document Analysis | Patient records, research papers |
| 📊 **Finance** | Financial Report Analysis | Key metrics, trend identification |

---

## 🚀 Deployment

### 🤗 Hugging Face Spaces
```bash
# Push to Hugging Face
git push origin main
# Configure secrets in HF Spaces dashboard
```

### 🔷 Vercel (Frontend)
```bash
# Deploy to Vercel
vercel --prod
# Set environment variables in Vercel dashboard
```

### 🐳 Docker
```bash
# Build and run with Docker
docker-compose up --build
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost/documenter_db

# Security
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE_MINUTES=1440

# File Upload
MAX_FILE_SIZE_MB=50
UPLOAD_DIR=./uploads

# Vector Store
FAISS_INDEX_PATH=./vector_store/
EMBEDDING_MODEL=all-MiniLM-L6-v2
```

#### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# App Configuration
NEXT_PUBLIC_APP_NAME=DocuMentor AI
NEXT_PUBLIC_MAX_FILE_SIZE=52428800
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test

# Integration tests
npm run test:e2e
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/TypeScript
- Add tests for new features
- Update documentation as needed

---

## 🐛 Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| FAISS index not persisting | Ensure write permissions on vector_store/ |
| Large PDF processing timeout | Increase timeout in FastAPI settings |
| Memory usage high | Implement document chunking optimization |

---

## 🗺️ Roadmap

### 🎯 Short Term (v1.1)
- [ ] Multi-document Q&A support
- [ ] Chat history and memory
- [ ] OCR support for image-based PDFs
- [ ] Export summaries to different formats

### 🚀 Medium Term (v1.2)
- [ ] Multi-user document sharing
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Mobile app development

### 🌟 Long Term (v2.0)
- [ ] Multi-language support
- [ ] Custom AI model training
- [ ] Enterprise features
- [ ] Advanced document workflows

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💙 About

<div align="center">
  
**Made with 💙 by [Yadushree K](https://github.com/yadushree2002)**

*If you find this project helpful, please consider giving it a ⭐ on GitHub!*

### 📬 Contact & Support

- 📧 Email: [kyadushree47@gmail.com](kyadushree47@gmail.com)
- 🐦 Twitter: [https://x.com/KYadushree](https://x.com/KYadushree)
- 💼 LinkedIn: [https://www.linkedin.com/in/yadushree/](https://www.linkedin.com/in/yadushree/)

---

**🙏 Acknowledgments**
- Google Gemini for AI capabilities
- Hugging Face for model hosting
- The open-source community for amazing tools

</div>

---

<div align="center">
  <p>
    <strong>⭐ Star this repo if you find it helpful!</strong><br>
    <sub>Built with ❤️ for the developer community</sub>
  </p>
</div>
