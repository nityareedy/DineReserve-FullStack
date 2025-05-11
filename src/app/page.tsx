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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('');

  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Discover Your Next Favorite Restaurant</h2>
            <p className="text-xl mb-8">Search, review, and explore restaurants in your area</p>
            <div className="flex max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search for restaurants or cuisines"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow text-black bg-white"
              />
              <Button className="ml-2" onClick={() => router.push(`/restaurants?query=${searchQuery}`)}>
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
            <div className="flex max-w-md mt-4 mx-auto">
              <Input
                type="text"
                placeholder="Type zipcode for restaurants or cuisines"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="flex-grow text-black bg-white"
              />
              <Button className="ml-2" onClick={() => router.push(`/search?query=${searchQuery}`)}>
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<MapPin className="h-10 w-10 text-primary" />}
                title="Location-based Search"
                description="Find restaurants near you or in specific zip codes"
              />
              <FeatureCard
                icon={<Star className="h-10 w-10 text-primary" />}
                title="Ratings & Reviews"
                description="Read and submit reviews to help others discover great food"
              />
              <FeatureCard
                icon={<PenSquare className="h-10 w-10 text-primary" />}
                title="Detailed Listings"
                description="Get comprehensive information about each restaurant"
              />
            </div>
          </div>
        </section>

        {/* User Roles Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">For Every User</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <UserRoleCard
                icon={<Search className="h-10 w-10 text-primary" />}
                title="Diners"
                description="Search, review, and discover new restaurants"
                buttonText="Start Exploring"
                onClick={() => router.push('/restaurants')}
              />
              <UserRoleCard
                icon={<Store className="h-10 w-10 text-primary" />}
                title="Business Owners"
                description="List and manage your restaurant information"
                buttonText="List Your Restaurant"
                onClick={() => router.push('/business-owner')}
              />
              <UserRoleCard
                icon={<ShieldCheck className="h-10 w-10 text-primary" />}
                title="Admins"
                description="Manage listings and ensure quality content"
                buttonText="Admin Portal"
                onClick={() => router.push('/admin')}
              />
            </div>
          </div>
        </section>
      </main>
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