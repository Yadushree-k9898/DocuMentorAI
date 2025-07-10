'use client';

import { useState } from 'react';
import api from '@/lib/api';
import SummaryBlock from '@/components/SummaryBlock';

export default function Summary({ docId }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/documents/${docId}/summarize`);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setError('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Summarizing...' : 'Generate Summary'}
      </button>

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

      <SummaryBlock summary={summary} />
    </div>
  );
}
