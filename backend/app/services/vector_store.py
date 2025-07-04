import faiss
import numpy as np
import os
import pickle

VECTOR_DIM = 384  

index = faiss.IndexFlatL2(VECTOR_DIM)
metadata_store = []

def add_to_vector_store(doc_id: str, chunk, embedding):
    global metadata_store, index
    embedding_np = np.array([embedding]).astype("float32")
    index.add(embedding_np)
    metadata_store.append({
        "doc_id": doc_id,
        "chunk_id": chunk.chunk_id,
        "content": chunk.content,
        "page_number": chunk.page_number
    })

def save_index(path="vector_store/index.faiss", meta_path="vector_store/meta.pkl"):
    faiss.write_index(index, path)
    with open(meta_path, "wb") as f:
        pickle.dump(metadata_store, f)

def load_index(path="vector_store/index.faiss", meta_path="vector_store/meta.pkl"):
    global index, metadata_store
    if os.path.exists(path) and os.path.exists(meta_path):
        index = faiss.read_index(path)
        with open(meta_path, "rb") as f:
            metadata_store = pickle.load(f)
