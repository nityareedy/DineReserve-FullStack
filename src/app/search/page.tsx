'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';

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
      setRestaurants(data.results);
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
    <div className="max-w-10xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurants near by {zipCode}</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter ZIP code"
          className="border p-2 mr-2 flex-grow"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button 
          className="ml-2 p-6"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 max-h-screen overflow-y-auto">
        <div className="flex-1">
          {map}
        </div>
        <div className="flex-1 grid md:grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.place_id} className="w-full">
              <CardHeader>
                <CardTitle>{restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{restaurant.formatted_address}</p>
                <div className="flex justify-between items-center">
                  <div>
                    {restaurant.rating && (
                      <span className="text-yellow-500">
                        ★ {restaurant.rating.toFixed(1)} 
                        {restaurant.user_ratings_total && 
                          ` (${restaurant.user_ratings_total} reviews)`}
                      </span>
                    )}
                  </div>
                  <div className="text-green-600">
                    {restaurant.price_level && (
                      <>Price: {renderPriceLevel(restaurant.price_level)}</>
                    )}
                  </div>
                </div>
                {restaurant.opening_hours && (
                  <div className={`mt-2 ${restaurant.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                    {restaurant.opening_hours.open_now ? 'Open Now' : 'Closed'}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}