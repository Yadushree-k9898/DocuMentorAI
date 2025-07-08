import faiss
import numpy as np
import os
import pickle

VECTOR_DIM = 384

# Use global dict to manage per-document indexes
vectorstores = {}

def get_index_path(doc_id):
    return f"vector_store/index_{doc_id}.faiss", f"vector_store/meta_{doc_id}.pkl"

def add_to_vector_store(doc_id: str, chunk, embedding):
    index_path, meta_path = get_index_path(doc_id)
    if doc_id not in vectorstores:
        index = faiss.IndexFlatL2(VECTOR_DIM)
        metadata_store = []
        vectorstores[doc_id] = {"index": index, "meta": metadata_store}
    else:
        index = vectorstores[doc_id]["index"]
        metadata_store = vectorstores[doc_id]["meta"]

    embedding_np = np.array([embedding]).astype("float32")
    index.add(embedding_np)
    metadata_store.append(chunk)

def save_index(doc_id: str):
    os.makedirs("vector_store", exist_ok=True)
    index_path, meta_path = get_index_path(doc_id)
    data = vectorstores[doc_id]
    faiss.write_index(data["index"], index_path)
    with open(meta_path, "wb") as f:
        pickle.dump(data["meta"], f)

def load_vectorstore(doc_id: str):
    index_path, meta_path = get_index_path(doc_id)
    if not os.path.exists(index_path) or not os.path.exists(meta_path):
        raise FileNotFoundError

    index = faiss.read_index(index_path)
    with open(meta_path, "rb") as f:
        metadata_store = pickle.load(f)

    class VectorStore:
        def __init__(self, index, metadata_store):
            self.index = index
            self.metadata_store = metadata_store

        def similarity_search(self, query: str, k: int = 3):
            embedding = SentenceTransformer("all-MiniLM-L6-v2").encode(query).astype("float32")
            embedding = np.expand_dims(embedding, axis=0)
            distances, indices = self.index.search(embedding, k)
            return [DummyDoc(self.metadata_store[i]["content"]) for i in indices[0] if i < len(self.metadata_store)]

    class DummyDoc:
        def __init__(self, page_content):
            self.page_content = page_content

    return VectorStore(index, metadata_store)
