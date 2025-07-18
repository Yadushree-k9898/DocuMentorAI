'use client';

import { useState, useCallback, Suspense, lazy } from 'react';
import api from '@/lib/api';
import { ENDPOINTS } from '../../../constants/endpoints';

// 🔁 Lazy load SummaryBlock for performance
const SummaryBlock = lazy(() => import('@/components/SummaryBlock'));

export default function Summary({ docId }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 📘 Summarize handler (memoized)
  const handleSummarize = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(ENDPOINTS.DOCUMENTS.SUMMARIZE);
      setSummary(res.data.summary);
    } catch (err) {
      console.error('[❌] Summary error:', err);
      setError('❌ Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  }, [docId]);

  return (
    <div className="mt-4">
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Summarizing...' : '📝 Generate Summary'}
      </button>

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

      <div className="mt-4">
        <Suspense fallback={<p className="text-gray-500">📄 Loading summary block...</p>}>
          <SummaryBlock summary={summary} />
        </Suspense>
      </div>
    </div>
  );
}
