'use client';
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import RestaurantCard from '@/components/RestaurantCard';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UploadButton } from "@/utils/uploadthing";
import ShimmerEffect from './ShimmerEffect';
import { ToastAction } from './ui/toast';
import { Users, Utensils, CalendarCheck } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatDistanceToNow } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
}

interface DuplicateGroup {
  name: string;
  address: string;
  restaurants: Restaurant[];
}

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
  const isAdmin = true; 
  const [loading, setLoading] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newZipcode, setNewZipcode] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newPriceRange, setNewPriceRange] = useState('');
  const [newRatings, setNewRatings] = useState<number | string>('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<{ userCount: number; restaurantCount: number; bookingCount: number }>({ userCount: 0, restaurantCount: 0, bookingCount: 0 });

  // --- User Analytics Panel ---
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(setUserAnalytics);
  }, []);

  // --- Trends State ---
  const [trends, setTrends] = useState<any>(null);
  const [trendsLoading, setTrendsLoading] = useState(true);
  useEffect(() => {
    setTrendsLoading(true);
    fetch('/api/admin/trends')
      .then(res => res.json())
      .then(data => {
        setTrends(data);
        setTrendsLoading(false);
      });
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/restaurants');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    // Fetch analytics
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data));
  }, []);

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this restaurant?');
  
    if (!isConfirmed) {
      return; 
    }
  
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== id));
        toast({
          description: "Restaurant deleted successfully!",
        })
      } else {
        console.error('Failed to delete restaurant');
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to delete the restaurant. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })

      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while deleting the restaurant.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };

  const handleEdit = async (id: number) => {
    if (!editRestaurant) return;
  
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName || editRestaurant.name,
          description: newDescription || editRestaurant.description,
          address: newAddress || editRestaurant.address,
          zipcode: newZipcode || editRestaurant.zipcode,
          cuisine: newCuisine || editRestaurant.cuisine,
          priceRange: newPriceRange || editRestaurant.priceRange,
          ratings: Number(newRatings) || editRestaurant.ratings,
          imageUrl: newImageUrl || editRestaurant.imageUrl,
        }),
      });
  
      if (response.ok) {
        setRestaurants((prev) =>
          prev.map((restaurant) =>
            restaurant.id === id
              ? {
                  ...restaurant,
                  name: newName || restaurant.name,
                  description: newDescription || restaurant.description,
                  address: newAddress || restaurant.address,
                  zipcode: newZipcode || restaurant.zipcode,
                  cuisine: newCuisine || restaurant.cuisine,
                  priceRange: newPriceRange || restaurant.priceRange,
                  ratings: Number(newRatings) || restaurant.ratings,
                  imageUrl: newImageUrl || restaurant.imageUrl,
                }
              : restaurant
          )
        );
        setEditRestaurant(null);
        resetForm();
        toast({
          description: "Restaurant updated successfully!",
        })
      } else {
        console.error('Failed to update restaurant');
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to update the restaurant. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (error) {
      console.error('Error editing restaurant:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while updating the restaurant.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };
  
  const handleCancelEdit = () => {
    setEditRestaurant(null);
    resetForm();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-token-expiration');
    toast({
      description: "Logged out successfully.",
    });

    window.location.href = '/restaurants';
  };
  
  const resetForm = () => {
    setNewName('');
    setNewDescription('');
    setNewAddress('');
    setNewZipcode('');
    setNewCuisine('');
    setNewPriceRange('');
    setNewRatings('');
    setNewImageUrl('');
  };

  const detectDuplicates = () => {
    const duplicateGroups: DuplicateGroup[] = [];
    const seen = new Map<string, Restaurant[]>();

    // Group restaurants by name and address combination
    restaurants.forEach(restaurant => {
      const key = `${restaurant.name.toLowerCase()}-${restaurant.address.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.set(key, []);
      }
      seen.get(key)?.push(restaurant);
    });

    // Filter out groups with more than one restaurant
    seen.forEach((group, key) => {
      if (group.length > 1) {
        const [name, address] = key.split('-');
        duplicateGroups.push({
          name,
          address,
          restaurants: group
        });
      }
    });

    setDuplicates(duplicateGroups);
    setShowDuplicatesModal(true);
    
    if (duplicateGroups.length === 0) {
      toast({
        description: "No duplicate restaurants found!",
      });
    }
  };

  if(loading){
    return <ShimmerEffect/>
  }

  return (
    <main className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* User Analytics Panel */}
      {userAnalytics && (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 border border-gray-100 items-stretch">
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Users className="w-5 h-5" /> Total Users</h2>
            <p className="text-4xl font-extrabold text-blue-600 drop-shadow">{userAnalytics.totalUsers}</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><CalendarCheck className="w-5 h-5" /> New Users (Last 7 Days)</h2>
            <p className="text-4xl font-extrabold text-green-600 drop-shadow">{userAnalytics.newUsersLast7Days}</p>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Users className="w-5 h-5" /> Recent Registrations</h2>
            <ul className="flex-1 min-h-0 max-h-48 overflow-y-auto divide-y divide-gray-200">
              {Array.isArray(userAnalytics.recentUsers) && userAnalytics.recentUsers.length > 0 ? (
                userAnalytics.recentUsers.map((user: any) => (
                  <li key={user.id} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-lg shadow">
                      {user.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{user.name}</span> <span className="text-xs text-gray-500">({user.email})</span><br />
                      <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No recent registrations.</li>
              )}
            </ul>
          </div>
        </div>
      )}
      {/* Trend Graphs */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendsLoading ? (
          <div className="col-span-3 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : trends && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col">
              <h3 className="font-semibold mb-4 text-blue-700 text-lg text-center">User Registrations (Last 30 Days)</h3>
              <Line
                data={{
                  labels: trends.dates,
                  datasets: [
                    {
                      label: 'Users',
                      data: trends.userCounts,
                      borderColor: 'rgba(59,130,246,1)',
                      backgroundColor: 'rgba(59,130,246,0.15)',
                      fill: true,
                      tension: 0.4,
                      pointRadius: 3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                  scales: { x: { ticks: { maxTicksLimit: 7 } } },
                }}
              />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col">
              <h3 className="font-semibold mb-4 text-green-700 text-lg text-center">Restaurants Added (Last 30 Days)</h3>
              <Line
                data={{
                  labels: trends.dates,
                  datasets: [
                    {
                      label: 'Restaurants',
                      data: trends.restaurantCounts,
                      borderColor: 'rgba(16,185,129,1)',
                      backgroundColor: 'rgba(16,185,129,0.15)',
                      fill: true,
                      tension: 0.4,
                      pointRadius: 3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                  scales: { x: { ticks: { maxTicksLimit: 7 } } },
                }}
              />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col">
              <h3 className="font-semibold mb-4 text-orange-700 text-lg text-center">Bookings (Last 30 Days)</h3>
              <Line
                data={{
                  labels: trends.dates,
                  datasets: [
                    {
                      label: 'Bookings',
                      data: trends.bookingCounts,
                      borderColor: 'rgba(234,88,12,1)',
                      backgroundColor: 'rgba(234,88,12,0.15)',
                      fill: true,
                      tension: 0.4,
                      pointRadius: 3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                  scales: { x: { ticks: { maxTicksLimit: 7 } } },
                }}
              />
            </div>
          </>
        )}
      </div>
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/30 shadow-lg p-6 flex flex-col items-center text-center animate-fade-in">
          <Users className="text-primary mb-2" size={32} />
          <div className="text-3xl font-bold">{analytics.userCount}</div>
          <div className="text-gray-700 font-medium mt-1">Users</div>
        </div>
        <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/30 shadow-lg p-6 flex flex-col items-center text-center animate-fade-in">
          <Utensils className="text-primary mb-2" size={32} />
          <div className="text-3xl font-bold">{analytics.restaurantCount}</div>
          <div className="text-gray-700 font-medium mt-1">Restaurants</div>
        </div>
        <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/30 shadow-lg p-6 flex flex-col items-center text-center animate-fade-in">
          <CalendarCheck className="text-primary mb-2" size={32} />
          <div className="text-3xl font-bold">{analytics.bookingCount}</div>
          <div className="text-gray-700 font-medium mt-1">Bookings</div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center m-4 pr-5">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-2 pr-4">
          <Button onClick={detectDuplicates}>
            Detect Duplicates
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            Log Out
          </Button>
        </div>
      </div>  

      <RestaurantCard 
        restaurants={restaurants} 
        onDeleteClick={handleDelete}
        onEditClick={(restaurant:any) => setEditRestaurant(restaurant)} 
        isAdmin={isAdmin} 
        isBusinessOwner={false}
      />

      {/* Duplicates Modal */}
      {showDuplicatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Duplicate Restaurants</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowDuplicatesModal(false)}
              >
                ✕
              </Button>
            </div>
            
            {duplicates.length === 0 ? (
              <p>No duplicate restaurants found.</p>
            ) : (
              duplicates.map((group, index) => (
                <div key={index} className="mb-6 border-b pb-4">
                  <h3 className="font-medium mb-2">
                    Duplicate Group {index + 1}: {group.name}
                  </h3>
                  <p className="text-gray-600 mb-2">Address: {group.address}</p>
                  <div className="grid grid-cols-1 gap-4">
                    {group.restaurants.map((restaurant) => (
                      <div key={restaurant.id} className="bg-gray-50 p-3 rounded">
                        <p><strong>ID:</strong> {restaurant.id}</p>
                        <p><strong>Name:</strong> {restaurant.name}</p>
                        <p><strong>Address:</strong> {restaurant.address}</p>
                        <p><strong>Zipcode:</strong> {restaurant.zipcode}</p>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="mt-2"
                          onClick={() => handleDelete(restaurant.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {editRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Restaurant</h2>
            <input
              type="text"
              value={newName || editRestaurant.name}
              onChange={(e) => setNewName(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Name"
            />
            <textarea
              value={newDescription || editRestaurant.description}
              onChange={(e) => setNewDescription(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Description"
            />
            <input
              type="text"
              value={newAddress || editRestaurant.address}
              onChange={(e) => setNewAddress(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Address"
            />
            <input
              type="text"
              value={newZipcode || editRestaurant.zipcode}
              onChange={(e) => setNewZipcode(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Zipcode"
            />
            <input
              type="text"
              value={newCuisine || editRestaurant.cuisine}
              onChange={(e) => setNewCuisine(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Cuisine"
            />
            <Select value={newPriceRange || editRestaurant.priceRange} onValueChange={setNewPriceRange}>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Select Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <input
              type="number"
              value={newRatings || editRestaurant.ratings}
              onChange={(e) => setNewRatings(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Edit Ratings"
            />
            <div className="mb-2 border rounded px-2 py-1 w-full">
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    const newImageUrl = res[0].url; 
                    setNewImageUrl(newImageUrl); 
                    alert("Upload Completed");
                  }
                }}
                onUploadError={(error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>


            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => handleEdit(editRestaurant.id)}
              >
                Save
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="destructive">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
