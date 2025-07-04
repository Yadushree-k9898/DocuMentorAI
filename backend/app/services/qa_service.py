from app.services.embedding_utils import split_text, save_embeddings_to_faiss, load_vectorstore
from langchain.chains.question_answering import load_qa_chain
from langchain_google_genai import ChatGoogleGenerativeAI

def process_document(doc_id: str, text: str):
    chunks = split_text(text)
    save_embeddings_to_faiss(chunks, doc_id)
    return {"message": "Document embedded and stored successfully", "chunks": len(chunks)}

def answer_question(doc_id: str, question: str):
    vectorstore = load_vectorstore(doc_id)
    relevant_docs = vectorstore.similarity_search(question, k=3)

    model = ChatGoogleGenerativeAI(model="models/gemini-1.5-pro") 
    qa_chain = load_qa_chain(model, chain_type="stuff")

    response = qa_chain.run(input_documents=relevant_docs, question=question)
    return {"answer": response}
