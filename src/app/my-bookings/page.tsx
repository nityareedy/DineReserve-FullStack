"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Booking {
  id: number;
  restaurant: { name: string };
  date: string;
  time: string;
  numberOfPeople: number;
  status: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("user-token") || localStorage.getItem("admin-token");
      if (!token) {
        router.push("/user/login");
        return;
      }
      try {
        const res = await fetch("/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [router]);

  // Group bookings
  const today = new Date().toISOString().split("T")[0];
  const past: Booking[] = [];
  const current: Booking[] = [];
  const upcoming: Booking[] = [];
  bookings.forEach((b) => {
    if (b.date < today) past.push(b);
    else if (b.date === today) current.push(b);
    else upcoming.push(b);
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!loading && !error && (
        <>
          <BookingSection title="Upcoming Bookings" bookings={upcoming} />
          <BookingSection title="Today's Bookings" bookings={current} />
          <BookingSection title="Past Bookings" bookings={past} />
        </>
      )}
    </div>
  );
}

function BookingSection({ title, bookings }: { title: string; bookings: Booking[] }) {
  if (!bookings.length) return null;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded p-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold text-lg">{b.restaurant.name}</div>
              <div>Date: {b.date} &nbsp; Time: {b.time}</div>
              <div>People: {b.numberOfPeople}</div>
              <div>Status: <span className="font-semibold">{b.status}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 