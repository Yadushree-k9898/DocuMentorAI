'use client';

import { useEffect, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function ChatBox({ docId }) {
  const token = useAuthStore((state) => state.token);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 🔁 Load chat history on page load
  useEffect(() => {
    const fetchHistory = async () => {
     

      try {
  const res = await fetch(`/api/v1/qa/${docId}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`❌ Expected JSON, got: ${text.slice(0, 100)}...`);
  }

  if (Array.isArray(data)) {
    setHistory(data);
  } else {
    console.warn('[⚠️] Invalid chat history response:', data);
  }
} catch (err) {
  console.error('[❌] Failed to fetch chat history:', err.message || err);
}

    };

    if (token) fetchHistory();
  }, [docId, token]);

 
  const askQuestion = async () => {
  if (!question.trim()) return;

  setLoading(true);

  try {
    const res = await fetch(`/api/v1/qa/${docId}/ask?question=${encodeURIComponent(question)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`❌ Expected JSON, got: ${text.slice(0, 100)}...`);
    }

    const reply = data?.answer || data?.detail || '⚠️ No valid response from server.';
    setHistory((prev) => [...prev, { question, answer: reply }]);
  } catch (err) {
    console.error('[❌] Ask failed:', err.message || err);
    setHistory((prev) => [...prev, { question, answer: err.message || '❌ Failed to get answer.' }]);
  } finally {
    setQuestion('');
    setLoading(false);
  }
};

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-indigo-700 mb-2">💬 Ask a Question</h3>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. What skills does this person have?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
          disabled={loading}
        />
        <button
          onClick={askQuestion}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <SendHorizonal size={18} />
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-sm text-gray-600 animate-pulse">
          🤖 DocuMentorAI is thinking...
        </div>
      )}

      <div className="mt-4 space-y-4">
        {history.map((entry, idx) => (
          <div key={idx} className="bg-gray-100 rounded-lg p-4 border">
            <p className="text-sm font-medium text-gray-700 mb-1">🧠 Q: {entry.question}</p>
            <p className="text-sm text-gray-800 whitespace-pre-line">💡 A: {entry.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
