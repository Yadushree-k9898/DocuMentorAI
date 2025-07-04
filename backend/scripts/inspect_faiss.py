import sys
import os
from langchain_community.vectorstores import FAISS
from app.services.embedding_utils import get_embeddings

# Ensure Python can find your `app` module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

doc_id = 3  # Replace with your actual document ID
index_path = f"faiss_indexes/doc_{doc_id}"

# ✅ This allows loading the index safely if YOU created it
vectorstore = FAISS.load_local(index_path, get_embeddings(), allow_dangerous_deserialization=True)

print(f"\n✅ FAISS index loaded from: {index_path}")
print(f"Number of vectors in store: {len(vectorstore.docstore._dict)}\n")

for i, doc in enumerate(vectorstore.docstore._dict.values()):
    print(f"--- Chunk {i + 1} ---")
    print(doc.page_content)
    print()
