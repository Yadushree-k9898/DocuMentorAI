'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import DocumentCard from '../../components/DocumentCard';
import api from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasHydrated && !token) {
      router.push('/login');
    }
  }, [hasHydrated, token]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get('/documents/documents');
        setDocuments(res.data);
      } catch (err) {
        console.error('[❌] Failed to fetch docs:', err?.response?.data || err.message);
        setError('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDocs();
  }, [token]);

  const handleDelete = async (docId) => {
    const confirmed = window.confirm("Are you sure you want to delete this document and its chat history?");
    if (!confirmed) return;

    try {
      const res = await api.delete(`/documents/${docId}`);
      if (res.status === 204) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      } else {
        alert('❌ Failed to delete document.');
      }
    } catch (err) {
      console.error('❌ Delete error:', err?.response?.data || err.message);
      alert('Failed to delete document.');
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Documents</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/documents/upload')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Upload Document
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading documents...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-600">You haven’t uploaded any documents yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => {
            const cleanTitle = doc.filename.split('_').slice(1).join('_');
            return (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={cleanTitle}
                summary={doc.summary_preview}
                uploadedAt={doc.created_at}
                onDelete={() => handleDelete(doc.id)} // ✅ pass onDelete
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
