// pages/business-owner/register.tsx
'use client';

import { useState } from 'react';
import { useBusinessAuth } from '../../../hooks/useBusinessAuth';
import Link from 'next/link';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading, isAuthenticated } = useBusinessAuth();

  if (isAuthenticated) {
    return null; // Redirect handled by useBusinessAuth hook.
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    register(name, email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="register-page max-w-xl w-full space-y-6 p-8 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Business Owner Registration</h2>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <Link href="/business-owner/login" className="text-black hover:text-gray-800 font-medium">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
