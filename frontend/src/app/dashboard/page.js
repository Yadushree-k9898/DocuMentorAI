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
      console.log('[📡] Fetching documents...');
      const res = await api.get('/documents/documents'); // full URL becomes /api/v1/documents/documents
      console.log('[✅] Docs fetched:', res.data);
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
  const cleanTitle = doc.filename.split('_').slice(1).join('_'); // removes UUID
  return (
    <DocumentCard
      key={doc.id}
      id={doc.id}
      title={cleanTitle}
      summary={doc.summary_preview}
      uploadedAt={doc.created_at}
    />
  );
})}

        </div>
      )}
    </div>
  );
}
