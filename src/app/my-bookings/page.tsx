"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Booking {
  id: number;
  restaurant: { name: string; address: string };
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ date: string; time: string; numberOfPeople: number }>({ date: '', time: '', numberOfPeople: 2 });
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [localBookings, setLocalBookings] = useState<Booking[]>(bookings);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(localBookings.length / pageSize);

  useEffect(() => {
    setLocalBookings(bookings);
    setPage(1); // Reset to first page on bookings change
  }, [bookings]);

  const handleCancel = async (id: number) => {
    setLoadingId(id);
    const token = localStorage.getItem('user-token') || localStorage.getItem('admin-token');
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: 'cancelled' }),
      });
      if (res.ok) {
        setLocalBookings((prev) => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleEdit = (b: Booking) => {
    setEditingId(b.id);
    setEditData({ date: b.date, time: b.time, numberOfPeople: b.numberOfPeople });
  };

  const handleEditSave = async (id: number) => {
    setLoadingId(id);
    const token = localStorage.getItem('user-token') || localStorage.getItem('admin-token');
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...editData }),
      });
      if (res.ok) {
        setLocalBookings((prev) => prev.map(b => b.id === id ? { ...b, ...editData } : b));
        setEditingId(null);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const paginatedBookings = localBookings.slice((page - 1) * pageSize, page * pageSize);

  if (!localBookings.length) return null;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="space-y-4">
        {paginatedBookings.map((b) => (
          <div key={b.id} className="border rounded p-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold text-lg">{b.restaurant.name}</div>
              {b.restaurant.address && (
                <div className="text-gray-600 text-sm mb-1">{b.restaurant.address}</div>
              )}
              {editingId === b.id ? (
                <div className="flex flex-col gap-2 mt-2">
                  <input type="date" value={editData.date} onChange={e => setEditData(d => ({ ...d, date: e.target.value }))} />
                  <input type="text" value={editData.time} onChange={e => setEditData(d => ({ ...d, time: e.target.value }))} placeholder="Time (e.g. 11:00)" />
                  <input type="number" min={1} max={10} value={editData.numberOfPeople} onChange={e => setEditData(d => ({ ...d, numberOfPeople: Number(e.target.value) }))} />
                  <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleEditSave(b.id)} disabled={loadingId === b.id}>Save</button>
                  <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div>Date: {b.date.split('T')[0]} &nbsp; Time: {b.time}</div>
                  <div>People: {b.numberOfPeople}</div>
                  <div>Status: <span className="font-semibold">{b.status}</span></div>
                  <button className="text-blue-600 underline mt-2" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                    {expandedId === b.id ? 'Hide Details' : 'View Details'}
                  </button>
                  {expandedId === b.id && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border text-sm">
                      {/* Show more details if available in b.restaurant */}
                      <div><strong>Restaurant Name:</strong> {b.restaurant.name}</div>
                      {/* Add more fields here if available, e.g. address, cuisine, etc. */}
                      {/* <div><strong>Address:</strong> {b.restaurant.address}</div> */}
                      {/* <div><strong>Cuisine:</strong> {b.restaurant.cuisine}</div> */}
                      {/* <div><strong>Price Range:</strong> {b.restaurant.priceRange}</div> */}
                      {/* <div><strong>Special Requests:</strong> {b.specialRequests}</div> */}
                      <div><strong>Booking ID:</strong> {b.id}</div>
                    </div>
                  )}
                </>
              )}
            </div>
            {editingId !== b.id && (
              <div className="flex gap-2 mt-4 md:mt-0">
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(b)} disabled={b.status === 'cancelled'}>Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleCancel(b.id)} disabled={b.status === 'cancelled' || loadingId === b.id}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
} 