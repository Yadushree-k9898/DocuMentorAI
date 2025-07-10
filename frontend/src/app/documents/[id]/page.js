'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';

export default function DocumentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasHydrated && !token) {
      router.push('/login');
    }
  }, [hasHydrated, token]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await api.get(`/documents/documents/${id}`);
        setDocument(res.data);
      } catch (err) {
        console.error('[❌] Failed to fetch document:', err);
        setError('Failed to load document.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDocument();
  }, [id, token]);

  if (!token) return null;

  if (loading) return <div className="p-6 text-gray-600">Loading document...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!document) return null;

  const parsedText = Array.isArray(document.text)
    ? document.text
    : (() => {
        try {
          return JSON.parse(document.text);
        } catch {
          return [];
        }
      })();

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">📄 {document.filename.split('_').slice(1).join('_')}</h1>
      <p className="text-sm text-gray-500 mb-4">Uploaded on: {new Date(document.created_at).toLocaleString()}</p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-indigo-700 mb-2">Summary</h2>
        <p className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm text-gray-700 whitespace-pre-line">
          {document.summary || 'No summary yet.'}
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-indigo-700">Full Extracted Text</h2>
        {parsedText.length > 0 ? (
          parsedText.map((chunk, idx) => (
            <div key={idx} className="bg-white border rounded-md p-4 shadow-sm text-gray-800">
              <h4 className="text-sm text-gray-500 mb-2">Page {chunk.page_number ?? idx + 1}</h4>
              <p className="whitespace-pre-line text-sm">{chunk.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No extracted text found.</p>
        )}
      </div>
    </div>
  );
}
