'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useUserAuth } from '@/hooks/useUserAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useUserAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await login(email, password);

    if (token) {
      toast({
        description: "Logged in successfully",
      })
      router.push('/restaurants');
    } else {
      toast({
        title: "Login failed.",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">User Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <a href="/user/register" className="text-black hover:text-gray-800 font-medium">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
