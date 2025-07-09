'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../lib/api';

export default function DocumentDetailPage() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await api.get(`/documents/${id}`);
        setDoc(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocument();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-600">Loading document...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!doc) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{doc.filename}</h1>
      <p className="text-sm text-gray-500 mb-6">Uploaded: {new Date(doc.created_at).toLocaleString()}</p>
      <h2 className="text-lg font-semibold mb-2">Summary</h2>
      <p className="bg-gray-100 p-4 rounded-md text-gray-700 whitespace-pre-line">
        {doc.summary || 'No summary available.'}
      </p>
    </div>
  );
}
