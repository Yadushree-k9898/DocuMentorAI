from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
import os

from app.core.config import settings   
     

os.environ["GOOGLE_API_KEY"] = settings.gemini_api_key  


CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

def split_text(text: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    return splitter.create_documents([text])

def get_embeddings():
    return GoogleGenerativeAIEmbeddings(model="models/embedding-001")

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
