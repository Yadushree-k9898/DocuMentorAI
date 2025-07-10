'use client';

export default function SummaryBlock({ summary }) {
  if (!summary) return null;

  return (
    <div className="mt-6 p-4 bg-gray-100 border rounded-lg text-sm text-gray-800">
      <h2 className="font-semibold text-base mb-2">📄 Document Summary</h2>
      <p>{summary}</p>
    </div>
  );
}
