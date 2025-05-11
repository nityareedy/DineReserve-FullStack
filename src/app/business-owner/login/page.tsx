'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBusinessAuth } from '@/hooks/useBusinessAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, isAuthenticated } = useBusinessAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push('/business-dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await login(email, password);

      if (token) {
        localStorage.setItem('business-token', token);
        router.push('/business-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Business Owner Login</h1>
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
          Don&apos;t have an account? <Link href="/business-owner/register" className="text-primary font-semibold hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
