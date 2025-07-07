# app/services/embedding_utils.py

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

def split_text(text: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    return splitter.create_documents([text])

def get_embeddings():
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def save_embeddings_to_faiss(chunks, doc_id: str):
    vectorstore = FAISS.from_documents(chunks, embedding=get_embeddings())
    save_path = f"app/vectorstores/faiss/{doc_id}"
    os.makedirs(save_path, exist_ok=True)
    vectorstore.save_local(save_path)
    return save_path

def load_vectorstore(doc_id: str):
    path = f"app/vectorstores/faiss/{doc_id}"
    if not os.path.exists(path):
        raise FileNotFoundError("Vector store not found for this document.")
    return FAISS.load_local(path, embeddings=get_embeddings(), allow_dangerous_deserialization=True)
