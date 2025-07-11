const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/v1/auth/login`,
    REGISTER: `${BASE_URL}/api/v1/auth/register`,
  },

  DOCUMENTS: {
    UPLOAD: `${BASE_URL}/api/v1/documents/upload-pdf`,
    LIST: `${BASE_URL}/api/v1/documents/documents`,
    DETAIL: (docId) => `${BASE_URL}/api/v1/documents/documents/${docId}`,
    DELETE: (docId) => `${BASE_URL}/api/v1/documents/${docId}`,
    SUMMARIZE: (docId) => `${BASE_URL}/api/v1/documents/${docId}/summarize`,
  },

  QA: {
    ASK: (docId, question) => `${BASE_URL}/api/v1/qa/${docId}/ask?question=${encodeURIComponent(question)}`,
    HISTORY: (docId) => `${BASE_URL}/api/v1/qa/${docId}/history`,
    CLEAR_HISTORY: (docId) => `${BASE_URL}/api/v1/qa/${docId}/history`,
  },
};
