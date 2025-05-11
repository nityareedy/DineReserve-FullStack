'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '../../../hooks/useAdminAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin-dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await login(email, password);

      if (token) {
        localStorage.setItem('token', token);
        router.push('/admin-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold shadow hover:bg-primary/90 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          {/* Add any admin-specific links here if needed */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
