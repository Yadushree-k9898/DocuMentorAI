// components/AuthForm.js
'use client';

import { useState } from 'react';

export default function AuthForm({ isLogin = false, onSubmit }) {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl mb-4">{isLogin ? 'Login' : 'Register'}</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-2 px-3 py-2 border rounded"
        required
      />

      {!isLogin && (
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-2 px-3 py-2 border rounded"
          required
        />
      )}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded"
        required
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
