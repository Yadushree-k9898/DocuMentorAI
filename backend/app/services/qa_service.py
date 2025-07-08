import os
import json
import pickle
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from app.services.embedding_utils import split_text_into_chunks
from app.core.config import settings

# Google Gemini setup
import google.generativeai as genai
from google.generativeai import GenerativeModel

genai.configure(api_key=settings.gemini_api_key)

# ✅ Correct model name for SDK usage
gemini_model =  GenerativeModel("models/gemini-1.5-flash")

# 🧠 Embedding model setup
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
VECTOR_DIM = 384


def get_index_path(doc_id: str):
    return f"vector_store/index_{doc_id}.faiss", f"vector_store/meta_{doc_id}.pkl"


def process_document(doc_id: str, raw_chunks) -> dict:
    """
    Embeds document chunks using SentenceTransformer and stores FAISS index + metadata.
    Accepts either a list of dicts or a JSON-encoded string.
    """
    os.makedirs("vector_store", exist_ok=True)

    # 🧹 Parse string if needed
    if isinstance(raw_chunks, str):
        try:
            raw_chunks = json.loads(raw_chunks)
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON string for document chunks.")

    if not isinstance(raw_chunks, list):
        raise ValueError("Document text must be a list of chunk dictionaries.")

    # 📚 Extract valid text chunks
    text_chunks = [chunk.get("content", "") for chunk in raw_chunks if isinstance(chunk, dict) and chunk.get("content")]

    if not text_chunks:
        raise ValueError("No valid content found in document.")

    # 🔎 Embed and store chunks
    index = faiss.IndexFlatL2(VECTOR_DIM)
    metadata = []

    for chunk in text_chunks:
        sub_chunks = split_text_into_chunks(chunk, max_chunk_length=1000)
        for sub in sub_chunks:
            emb = embedding_model.encode(sub).astype("float32")
            index.add(np.array([emb]))
            metadata.append({"content": sub})

    index_path, meta_path = get_index_path(doc_id)
    faiss.write_index(index, index_path)
    with open(meta_path, "wb") as f:
        pickle.dump(metadata, f)

    return {"message": "Document embedded successfully", "chunks": len(metadata)}


def answer_question(doc_id: str, question: str, k: int = 3) -> dict:
    """
    Loads FAISS index and metadata, retrieves top-k relevant chunks,
    and uses Gemini to answer based on those.
    """
    index_path, meta_path = get_index_path(doc_id)

    if not os.path.exists(index_path) or not os.path.exists(meta_path):
        raise FileNotFoundError("Embedding files not found for this document.")

    # 🔓 Load vector index and metadata
    index = faiss.read_index(index_path)
    with open(meta_path, "rb") as f:
        metadata = pickle.load(f)

    # 📌 Embed the user's question
    q_emb = embedding_model.encode(question).astype("float32").reshape(1, -1)
    distances, indices = index.search(q_emb, k)

    # 🧠 Retrieve top-k chunks
    retrieved_chunks = [metadata[i]["content"] for i in indices[0] if i < len(metadata)]
    context = "\n\n".join(retrieved_chunks)

    prompt = f"""You are an intelligent assistant. Use the context below to answer the question.

Context:
{context}

Question:
{question}

Answer:"""

    try:
        response = gemini_model.generate_content(prompt)
        return {
            "answer": response.text.strip(),
            "matched_chunks": retrieved_chunks
        }
    except Exception as e:
        return {
            "error": f"Gemini failed: {str(e)}",
            "context": context
        }
