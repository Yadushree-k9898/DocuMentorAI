const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
  },

  DOCUMENTS: {
    UPLOAD: `${BASE_URL}/documents/upload-pdf`,
    LIST: `${BASE_URL}/documents/documents`,
    DETAIL: (docId) => `${BASE_URL}/documents/documents/${docId}`,
    DELETE: (docId) => `${BASE_URL}/documents/${docId}`, 
    SUMMARIZE: (docId) => `${BASE_URL}/documents/${docId}/summarize`,
  },

  QA: {
    ASK: (docId, question) => `${BASE_URL}/qa/${docId}/ask?question=${encodeURIComponent(question)}`,
    HISTORY: (docId) => `${BASE_URL}/qa/${docId}/history`,
    CLEAR_HISTORY: (docId) => `${BASE_URL}/qa/${docId}/history`,
  },


};


