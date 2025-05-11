import { Button } from "./ui/button";
import { useRouter } from 'next/navigation';
import { useState, useMemo } from "react";
import BookingForm from './BookingForm';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Restaurant = {
  id: number;
  name: string;
  description: string;
  address: string;
  cuisine: string;
  priceRange: string;
  ratings: number;
  imageUrl: string;
};

type RestaurantGridProps = {
  restaurants: Restaurant[];
  onEditClick?: (restaurant: Restaurant) => void;
  onDeleteClick?: (id: number) => void;
  isAdmin?: boolean; 
  isBusinessOwner?: boolean;
  onShowOnMap?: (restaurant: Restaurant) => void;
};

export default function RestaurantCardUser({ restaurants, onDeleteClick, onEditClick, isAdmin, isBusinessOwner, onShowOnMap }: RestaurantGridProps) {
  const router = useRouter();
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [modalRestaurant, setModalRestaurant] = useState<Restaurant | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  // Get unique cuisines from restaurants
  const cuisines = useMemo(() => {
    const uniqueCuisines = new Set(restaurants.map(r => r.cuisine));
    return Array.from(uniqueCuisines);
  }, [restaurants]);

  // Filter restaurants based on selected criteria
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      const cuisineMatch = selectedCuisine === "all" || restaurant.cuisine === selectedCuisine;
      const priceMatch = selectedPriceRange === "all" || restaurant.priceRange === selectedPriceRange;
      const ratingMatch = selectedRating === "all" || restaurant.ratings >= parseInt(selectedRating);
      return cuisineMatch && priceMatch && ratingMatch;
    });
  }, [restaurants, selectedCuisine, selectedPriceRange, selectedRating]);

  const handleReset = () => {
    setSelectedCuisine("all");
    setSelectedPriceRange("all");
    setSelectedRating("all");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="min-w-[200px]">
          <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Cuisine" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Cuisines</SelectItem>
                {cuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px]">
          <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px]">
          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
                <SelectItem value="1">1+ Stars</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          onClick={handleReset}
          className="whitespace-nowrap"
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {filteredRestaurants.map((restaurant: Restaurant) => (
          <div
            key={restaurant.id}
            className="border rounded p-4 shadow hover:shadow-lg cursor-pointer"
            onClick={() => setModalRestaurant(restaurant)}
          >
            <img
              src={restaurant.imageUrl}
              alt={`${restaurant.name} image`}
              width={400}
              height={300}
              className="mb-4 rounded object-cover"
              loading="lazy"
            />
            <h3 className="text-lg font-semibold truncate">{restaurant.name}</h3>
            <p className="truncate">{restaurant.description}</p>
            <p className="truncate">
              <strong>Address:</strong> {restaurant.address}
            </p>
            <p className="truncate">
              <strong>Cuisine:</strong> {restaurant.cuisine}
            </p>
            <p className="truncate">
              <strong>Price Range:</strong> {restaurant.priceRange}
            </p>
            <p>
              <strong>Ratings:</strong> {restaurant.ratings} ★
            </p>
            {isAdmin && (
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick && onEditClick(restaurant);
                  }}
                >
                  Edit
                </Button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick && onDeleteClick(restaurant.id);
                  }}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            )}
            {isBusinessOwner && (
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick && onEditClick(restaurant);
                  }}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for restaurant details */}
      {modalRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={() => { setModalRestaurant(null); setShowBooking(false); }}
            >
              &times;
            </button>
            <img
              src={modalRestaurant.imageUrl}
              alt={`${modalRestaurant.name} image`}
              className="mb-4 rounded object-cover w-full h-56"
            />
            <h2 className="text-2xl font-bold mb-2">{modalRestaurant.name}</h2>
            <p className="mb-2">{modalRestaurant.description}</p>
            <p className="mb-1"><strong>Address:</strong> {modalRestaurant.address}</p>
            <p className="mb-1"><strong>Cuisine:</strong> {modalRestaurant.cuisine}</p>
            <p className="mb-1"><strong>Price Range:</strong> {modalRestaurant.priceRange}</p>
            <p className="mb-1"><strong>Ratings:</strong> {modalRestaurant.ratings} ★</p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setShowBooking(true)}>
                Book Now
              </Button>
              {onShowOnMap && (
                <Button variant="outline" onClick={() => { onShowOnMap(modalRestaurant); setModalRestaurant(null); }}>
                  Show on Map
                </Button>
              )}
            </div>
            {showBooking && (
              <div className="mt-6">
                <BookingForm restaurantId={modalRestaurant.id} restaurantName={modalRestaurant.name} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
