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
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-video">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Address:</strong> {restaurant.address}
              <br />
              <strong>Zipcode:</strong> {restaurant.zipcode}
            </div>
            <div>
              <strong>Cuisine:</strong> {restaurant.cuisine}
              <br />
              <strong>Price Range:</strong> {restaurant.priceRange}
              <br />
              <strong>Ratings:</strong> {restaurant.ratings} ★
            </div>
          </div>

          {restaurant.owner && (
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold mb-2">Restaurant Owner</h3>
              <p>{restaurant.owner.name}</p>
              <p>{restaurant.owner.email}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <div className="flex gap-2">
            <Button onClick={() => setIsModalOpen(true)}>Leave a Review</Button>
            <Button variant="destructive" onClick={handlelogout}>Logout</Button>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Review Content</h2>
              <input
                type="text"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Write your review here"
                className="mb-2 border rounded px-2 py-1 w-full"
              />
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full p-2 border rounded mb-2"
              />
              <div className="flex justify-end space-x-2">
                <Button onClick={handleReviewSubmit}>Submit Review</Button>
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
        {restaurant.reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div
            className="space-y-4 overflow-y-auto"
            style={{ maxHeight: "calc(3 * 8rem + 2rem)" }}
          >
            {restaurant.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <p>{review.content}</p>
                <div className="text-yellow-500">
                  <div className="flex justify-between items-center mb-2">
                    <span>{"★".repeat(review.rating)}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
