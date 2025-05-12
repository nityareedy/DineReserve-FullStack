'use client';
import React, { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
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

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  zipcode: string ;
  cuisine: string;
  priceRange: string;
  ratings: number;
  imageUrl: string;
}

const DashboardPage = () => {
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editCompleted, setEditCompleted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();


  function resetForm() {
    setNewName('');
    setNewDescription('');
    setNewAddress('');
    setNewZipcode('');
    setNewCuisine('');
    setNewPriceRange('');
    setNewRatings('');
    setNewImageUrl('');
  }

  const handleCancelEdit = () => {
    setEditRestaurant(null);
    resetForm();
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/restaurants/business', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('business-token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Failed to fetch restaurants.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          })
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "An error occurred while fetching restaurants.",
          action: <ToastAction altText="Try again">Try again</ToastAction>
        })
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, [editCompleted]);

  useEffect(() => {
    if(editRestaurant) {
      setEditCompleted(false);
    }
  }, [editRestaurant]);

  const handleAddRestaurant = async () => {
    if (!newRestaurantName || !newImageUrl) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please enter a restaurant name and upload an image.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      return;
    }
  
    try {
      const response = await fetch('/api/restaurants/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('business-token')}`,
        },
        body: JSON.stringify({
          name: newRestaurantName,
          description: newDescription,
          address: newAddress,
          zipcode: newZipcode,
          cuisine: newCuisine,
          priceRange: newPriceRange,
          ratings: Number(newRatings),
          imageUrl: newImageUrl, 
        }),
      });
  
      if (response.ok) {
        const newRestaurant = await response.json();
        setRestaurants([...restaurants, newRestaurant]);
        resetForm();
        toast({
          description: "Restaurant added successfully.",
        })
        setIsModalOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to add restaurant.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (error) {
      console.error('Error adding restaurant:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while adding the restaurant.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };
  
  const handleEditClick = async (id:number) => {
    if (!editRestaurant) return;
  
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('business-token')}`,
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
              ? { ...restaurant, imageUrl: newImageUrl || restaurant.imageUrl }
              : restaurant
          )
        );
        setEditRestaurant(null);
        resetForm();
        toast({
          description: "Restaurant updated successfully.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to update the restaurant. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
      setEditCompleted(true); 
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
  

  const handleDeleteClick = async (id:any) => {
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('business-token')}`,
        },
      });

      if (response.ok) {
        setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
        toast({
          description: "Restaurant deleted successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to delete restaurant.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while deleting the restaurant.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleLogout = () => {
    // Clear all tokens
    localStorage.removeItem('business-token');
    localStorage.removeItem('business-token-expiration');
    localStorage.removeItem('user-token');
    localStorage.removeItem('user-token-expiration');
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-token-expiration');
    toast({
      description: "Logged out successfully.",
    });
    router.push('/restaurants');
  };

  if (loading) {
    return <ShimmerEffect/>;
  }

  return (
    <div className="dashboard-page">
      <div className="w-full flex justify-between items-center m-4 pr-5">
        <h2 className="text-2xl font-bold">Your Restaurants</h2>
        <div className="pr-4">
          <Button onClick={() => setIsModalOpen(true)} >Add New Restaurant</Button>
          <Button onClick={handleLogout} variant="destructive" className="ml-2">Log Out</Button>
        </div>
      </div>  
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Restaurant</h2>
            <input
              type="text"
              value={newRestaurantName}
              onChange={(e) => setNewRestaurantName(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Restaurant Name"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Description"
            />
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Address"
            />
            <input
              type="text"
              value={newZipcode}
              onChange={(e) => setNewZipcode(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Zipcode"
            />
            <input
              type="text"
              value={newCuisine}
              onChange={(e) => setNewCuisine(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Cuisine"
            />
            <Select value={newPriceRange} onValueChange={setNewPriceRange}>
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
              value={newRatings}
              onChange={(e) => setNewRatings(e.target.value)}
              className="mb-2 border rounded px-2 py-1 w-full"
              placeholder="Ratings"
            />
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  const uploadedImageUrl = res[0].url;
                  setNewImageUrl(uploadedImageUrl);
                  alert("Upload Completed");
                }
              }}
              onUploadError={(error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleAddRestaurant}
              >
                Add
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
  
      <RestaurantCard
        restaurants={restaurants}
        onEditClick={(restaurant:any) => setEditRestaurant(restaurant)} 
        onDeleteClick={handleDeleteClick}
        isAdmin={false}
        isBusinessOwner={true}
      />
  
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
                onClick={() => handleEditClick(editRestaurant.id)}
              >
                Save
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;