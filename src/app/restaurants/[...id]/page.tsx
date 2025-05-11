"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import RestaurantDetailShimmer from "@/components/RestaurantDetailShimmer";
import { ToastAction } from "@/components/ui/toast";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Star, X } from 'lucide-react';
import BookingForm from "@/components/BookingForm";

interface Owner {
  id: number;
  name: string;
  email: string;
}

interface Review {
  id: number;
  content: string;
  rating: number;
  createdAt: Date;
  userId: number;
}

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
  owner: Owner;
  reviews: Review[];
}

const RestaurantDetailPage = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { toast } = useToast();
  const { isAuthenticated } = useUserAuth();
  const params = useParams();
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/user/login");
  };

  const handlelogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user-token-expiration");
    router.push("/restaurants");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    if (!restaurant) return;

    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "You must be logged in to submit a review.",
        action: (
          <ToastAction onClick={handleLoginRedirect} altText="Login">
            Login
          </ToastAction>
        ),
      });
      return;
    }

    let userId;
    try {
      const token = localStorage.getItem('user-token');
      if (token) {
        const decoded = jwtDecode<{ id: number }>(token);
        userId = decoded.id;
      }
    } catch (e) {
      console.error("Failed to decode JWT", e);
    }

    if (!userId) {
      toast({
        variant: "destructive",
        title: "User not found",
        description: "Could not determine the logged-in user.",
      });
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: reviewContent,
          rating: reviewRating,
          userId,
          restaurantId: restaurant.id,
        }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReview = await response.json();
      setRestaurant(
        (prev) => prev && { ...prev, reviews: [...prev.reviews, newReview] }
      );
      setReviewContent("");
      setReviewRating(5);
      setIsModalOpen(false);
      toast({
        description: "Review submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const id = params.id;

        if (!id) {
          toast({
            variant: "destructive",
            title: "No restaurant ID provided.",
            description: "Please provide a valid restaurant ID.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          return;
        }

        const response = await fetch(`/api/restaurants/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details");
        }

        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        toast({
          variant: "destructive",
          title: "Failed to load restaurant details",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [params.id]);

  if (loading) {
    return <RestaurantDetailShimmer />;
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-red-500">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero Image */}
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg mb-8">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2">{restaurant.name}</h1>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow">{restaurant.cuisine}</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow">{restaurant.priceRange}</span>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full shadow flex items-center gap-1">
                <Star size={14} className="inline text-yellow-500" /> {restaurant.ratings} ★
              </span>
            </div>
          </div>
        </div>

        {/* Restaurant Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-2">About</h2>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              <div className="mb-2"><strong>Address:</strong> {restaurant.address}</div>
              <div className="mb-2"><strong>Zipcode:</strong> {restaurant.zipcode}</div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Details</h2>
              <div className="mb-2"><strong>Cuisine:</strong> {restaurant.cuisine}</div>
              <div className="mb-2"><strong>Price Range:</strong> {restaurant.priceRange}</div>
              <div className="mb-2"><strong>Ratings:</strong> {restaurant.ratings} ★</div>
              {restaurant.owner && (
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-1">Restaurant Owner</h3>
                  <p>{restaurant.owner.name}</p>
                  <p className="text-xs text-gray-500">{restaurant.owner.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
          <BookingForm restaurantId={restaurant.id} restaurantName={restaurant.name} />
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <div className="flex gap-2">
              <Button onClick={() => setIsModalOpen(true)}>Leave a Review</Button>
              <Button variant="destructive" onClick={handlelogout}>Logout</Button>
            </div>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
                <h2 className="text-lg font-semibold mb-4">Write a Review</h2>
                <input
                  type="text"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Write your review here"
                  className="mb-4 border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-yellow-400 ${reviewRating >= star ? '' : 'opacity-30'}`}
                      onClick={() => setReviewRating(star)}
                    >
                      <Star size={24} />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-500">{reviewRating}/5</span>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={handleReviewSubmit}>Submit Review</Button>
                  <Button onClick={() => setIsModalOpen(false)} variant="destructive">Cancel</Button>
                </div>
              </div>
            </div>
          )}
          {restaurant.reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <img src="https://illustrations.popsy.co/gray/empty-state.svg" alt="No reviews" className="w-32 mb-4 opacity-80" />
              <p className="text-gray-500">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "calc(3 * 8rem + 2rem)" }}>
              {restaurant.reviews.map((review, idx) => (
                <div
                  key={review.id}
                  className="bg-gray-50 border rounded-lg p-4 shadow-sm animate-fade-in"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={18} className="text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
