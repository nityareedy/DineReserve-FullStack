'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Loader2, MapPin } from 'lucide-react';

interface Restaurant {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
  };
  price_level?: number;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: {
    photo_reference: string;
  }[];
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 37.7749, // Default latitude
  lng: -122.4194, // Default longitude
};

export default function RestaurantFinder() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [zipCode, setZipCode] = useState('');
  const [map, setMap] = useState<JSX.Element | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const renderPriceLevel = (level?: number) => {
    if (!level) return 'N/A';
    return '$'.repeat(level);
  };

  const handleSearch = () => {
    setLoading(true);
    setError(null);
    fetchRestaurants();
  };

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`/api/google-places?zip=${zipCode}`);
      const data = await response.json();
      console.log(data);
      setRestaurants(Array.isArray(data.results) ? data.results : []);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (restaurants.length > 0) {
      setMap(renderMap(restaurants));
    }
  }, [restaurants]);

  const renderMap = (restaurants: Restaurant[]) => (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={restaurants.length ? {
          lat: restaurants[0].geometry?.location.lat || defaultCenter.lat,
          lng: restaurants[0].geometry?.location.lng || defaultCenter.lng,
        } : defaultCenter}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.place_id}
            position={{
              lat: restaurant.geometry?.location.lat || defaultCenter.lat,
              lng: restaurant.geometry?.location.lng || defaultCenter.lng,
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-primary drop-shadow">Find Restaurants Near You</h1>
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter ZIP code"
            className="pl-10 pr-4 py-3 w-full rounded-full border shadow focus:outline-none focus:ring-2 focus:ring-primary transition"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 py-2 shadow"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-3 rounded-xl shadow flex items-center gap-2 animate-fade-in">
            <span>❌</span>
            <span>Failed to load restaurants. Please try again.</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 max-h-screen overflow-y-auto">
        <div className="flex-1">
          <div className="border rounded-2xl shadow-lg overflow-hidden mb-6 bg-white">
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center gap-2">
              <MapPin className="text-primary" size={20} />
              <span className="font-semibold text-gray-700">Map View</span>
            </div>
            {map}
          </div>
        </div>
        <div className="flex-1 grid md:grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
          {restaurants.length === 0 && !loading && !error && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 animate-fade-in">
              <img src="https://illustrations.popsy.co/gray/empty-state.svg" alt="No results" className="w-40 mb-4 opacity-80" />
              <p className="text-lg text-gray-500 font-medium">No restaurants found. Try a different ZIP code!</p>
            </div>
          )}
          {restaurants.map((restaurant, idx) => (
            <Card key={restaurant.place_id} className="w-full rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 bg-white animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b">
                {restaurant.photos && restaurant.photos.length > 0 ? (
                  <img
                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
                    alt={restaurant.name}
                    className="w-20 h-20 object-cover rounded-xl border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                    <Search size={32} />
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg font-bold mb-1">{restaurant.name}</CardTitle>
                  <p className="text-gray-600 text-sm mb-1 flex items-center gap-1"><MapPin size={14} className="inline text-primary" />{restaurant.formatted_address}</p>
                  <div className="flex items-center gap-2 mb-1">
                    {restaurant.rating && (
                      <span className="text-yellow-500 flex items-center">
                        {'★'.repeat(Math.round(restaurant.rating))}
                        <span className="ml-1 text-gray-500 text-xs">({restaurant.user_ratings_total})</span>
                      </span>
                    )}
                    {restaurant.price_level && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        {renderPriceLevel(restaurant.price_level)}
                      </span>
                    )}
                  </div>
                  {restaurant.opening_hours && (
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${restaurant.opening_hours.open_now ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {restaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}
                    </span>
                  )}
                  <button
                    className="text-blue-600 underline mt-2 text-sm"
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  >
                    {expandedIdx === idx ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </CardHeader>
              {expandedIdx === idx && (
                <div className="px-6 pb-4 animate-fade-in">
                  {restaurant.photos && restaurant.photos.length > 0 && (
                    <img
                      src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${restaurant.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
                      alt={restaurant.name}
                      className="w-full h-56 object-cover rounded-xl border mb-2"
                    />
                  )}
                  <div className="text-gray-800 mb-2">
                    {/* Google Places API may not provide a description, but you can show address, rating, etc. */}
                    <strong>Address:</strong> {restaurant.formatted_address}
                  </div>
                  {restaurant.rating && (
                    <div className="mb-1"><strong>Rating:</strong> {restaurant.rating} ({restaurant.user_ratings_total} reviews)</div>
                  )}
                  {restaurant.price_level && (
                    <div className="mb-1"><strong>Price Level:</strong> {renderPriceLevel(restaurant.price_level)}</div>
                  )}
                  {restaurant.opening_hours && (
                    <div className="mb-1"><strong>Status:</strong> {restaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}</div>
                  )}
                  {/* Add more details as needed */}
                </div>
              )}
              <CardContent className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  className="rounded-full px-4 py-1 text-sm border-primary hover:bg-primary hover:text-white transition"
                  onClick={() => {
                    if (restaurant.geometry && restaurant.geometry.location) {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${restaurant.geometry.location.lat},${restaurant.geometry.location.lng}`, '_blank');
                    }
                  }}
                >
                  View on Map
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}