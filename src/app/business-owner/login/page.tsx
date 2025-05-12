'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBusinessAuth } from '@/hooks/useBusinessAuth';
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, isAuthenticated } = useBusinessAuth();
  const router = useRouter();
  const { toast } = useToast();

  if (isAuthenticated) {
    router.push('/business-dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login for email:', email); // Debug log

    try {
      const token = await login(email, password);
      console.log('Login successful, token received:', !!token); // Debug log
      
      if (token) {
        toast({
          title: "Success",
          description: "Login successful",
        });
        router.push('/business-dashboard');
      } else {
        console.error('No token received from login'); // Debug log
        toast({
          variant: "destructive",
          title: "Error",
          description: "Login failed. Please check your credentials.",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">Business Owner Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-white/80"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-white/80"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold shadow transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-8 border-t pt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account? <Link href="/business-owner/register" className="text-orange-600 font-semibold hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
