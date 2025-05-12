'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Star, PenSquare, Store, ShieldCheck } from 'lucide-react';

interface UserRoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const RESTAURANT_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80'; // Example Unsplash restaurant image

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('');

  const router = useRouter();

  const handleNameSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/restaurants?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleZipSearch = () => {
    if (zipCode.trim()) {
      router.push(`/search?zip=${encodeURIComponent(zipCode)}`);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-x-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <img src={RESTAURANT_BG} alt="Restaurant background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      {/* Main content with frosted glass effect */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-24 mb-12 p-10 rounded-3xl backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl flex flex-col items-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4 text-center">Discover Your Next Favorite Restaurant</h1>
        <p className="text-lg text-gray-200 mb-8 text-center">Search, review, and explore restaurants in your area</p>
        <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search for restaurants or cuisines"
            className="flex-1 px-5 py-3 rounded-full bg-white/70 text-gray-800 placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-primary transition"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="px-6 py-3 rounded-full bg-primary text-white font-semibold shadow hover:bg-primary/90 transition" onClick={handleNameSearch}>Search</button>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Type zipcode for restaurants or cuisines"
            className="flex-1 px-5 py-3 rounded-full bg-white/70 text-gray-800 placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-primary transition"
            value={zipCode}
            onChange={e => setZipCode(e.target.value)}
          />
          <button className="px-6 py-3 rounded-full bg-primary text-white font-semibold shadow hover:bg-primary/90 transition" onClick={handleZipSearch}>Search</button>
        </div>
      </div>
      {/* Key Features Section */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4 animate-fade-in">
        <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-6 flex flex-col items-center text-center text-white">
          <span className="text-3xl mb-2">📍</span>
          <h3 className="font-bold text-lg mb-2">Location-based Search</h3>
          <p className="text-sm">Find restaurants near you or in specific zip codes</p>
        </div>
        <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-6 flex flex-col items-center text-center text-white">
          <span className="text-3xl mb-2">⭐</span>
          <h3 className="font-bold text-lg mb-2">Ratings & Reviews</h3>
          <p className="text-sm">Read and submit reviews to help others discover great food</p>
        </div>
        <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-6 flex flex-col items-center text-center text-white">
          <span className="text-3xl mb-2">📝</span>
          <h3 className="font-bold text-lg mb-2">Detailed Listings</h3>
          <p className="text-sm">Get comprehensive information about each restaurant</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function UserRoleCard({ icon, title, description, buttonText, onClick }: UserRoleCardProps) {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{description}</CardDescription>
        <Button className="w-full">{buttonText}</Button>
      </CardContent>
    </Card>
  );
}