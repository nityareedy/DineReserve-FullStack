import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  zipcode: string;
  cuisine: string;
  priceRange: string;
  ratings: number;
  imageUrl: string;
  owner: {
    name: string;
    email: string;
  };
}

export default function RestaurantApprovalRequests() {
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingRestaurants();
  }, []);

  const fetchPendingRestaurants = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch('/api/restaurants/approve', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        throw new Error('Authentication failed - please log in again');
      }

      if (response.status === 403) {
        throw new Error('Access denied - admin privileges required');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch pending restaurants');
      }

      const data = await response.json();
      setPendingRestaurants(data);
    } catch (error) {
      console.error('Error fetching pending restaurants:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch pending restaurant requests",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (restaurantId: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/restaurants/approve/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${status} restaurant`);
      }

      // Remove the restaurant from the list
      setPendingRestaurants(prev => prev.filter(r => r.id !== restaurantId));

      toast({
        description: `Restaurant ${status} successfully`,
      });
    } catch (error) {
      console.error(`Error ${status}ing restaurant:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${status} restaurant`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (pendingRestaurants.length === 0) {
    return <div className="text-center py-4">No pending restaurant requests</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Pending Restaurant Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="border rounded-lg p-4 shadow-sm">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
            <p className="text-gray-600 mb-2">{restaurant.description}</p>
            <div className="space-y-2">
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Zipcode:</strong> {restaurant.zipcode}</p>
              <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
              <p><strong>Price Range:</strong> {restaurant.priceRange}</p>
              <p><strong>Owner:</strong> {restaurant.owner.name}</p>
              <p><strong>Owner Email:</strong> {restaurant.owner.email}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                onClick={() => handleApproval(restaurant.id, 'approved')}
                className="bg-green-500 hover:bg-green-600"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleApproval(restaurant.id, 'rejected')}
                variant="destructive"
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 