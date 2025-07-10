'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';

const DocumentCard = ({ id, title, summary, uploadedAt, onDelete }) => {
  const router = useRouter();

  return (
    <div className="relative bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
      {/* 🗑️ Delete Button */}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
        title="Delete document"
      >
        🗑️
      </button>

      <h2 className="text-xl font-semibold text-gray-800 truncate mb-2">{title}</h2>
      <p className="text-gray-600 text-sm line-clamp-3">{summary}</p>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{new Date(uploadedAt).toLocaleDateString()}</span>
        <button
          onClick={() => router.push(`/documents/${id}`)}
          className="text-indigo-600 hover:underline font-medium"
        >
          View →
        </button>
      </div>
    </div>
  );
};

export default memo(DocumentCard);
