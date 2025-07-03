'use client';

import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">DocuMentorAI</h1>
      {user && (
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      )}
    </nav>
  );
}
