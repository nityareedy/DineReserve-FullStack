'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useUserAuth } from '@/hooks/useUserAuth';
import Link from 'next/link';

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
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background image with overlay */}
      <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80" alt="Login background" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">User Login</h1>
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
        <div className="mt-8 -mx-8 -mb-8 px-8 py-4 bg-white/60 backdrop-blur-md rounded-b-2xl text-center text-sm text-gray-700 shadow-inner">
          Don&apos;t have an account? <Link href="/user/register" className="text-orange-600 font-semibold hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
