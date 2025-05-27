import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/hooks/useUserAuth';

interface BookingFormProps {
  restaurantId: number;
  restaurantName: string;
}

const AVAILABLE_TIMES = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

export default function BookingForm({ restaurantId, restaurantName }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useUserAuth();

  useEffect(() => {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchBookedTimes(today);
  }, []);

  const fetchBookedTimes = async (date: string) => {
    try {
      const response = await fetch(`/api/bookings?restaurantId=${restaurantId}&date=${date}`);
      const data = await response.json();
      setBookedTimes(data.map((booking: any) => booking.time));
    } catch (error) {
      console.error('Error fetching booked times:', error);
      toast.error('Failed to fetch available times');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    fetchBookedTimes(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to book a table');
      router.push('/user/login');
      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem('user-token');
    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      router.push('/user/login');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          restaurantId,
          date: selectedDate,
          time: selectedTime,
          numberOfPeople,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Your session has expired. Please login again.');
          router.push('/user/login');
          return;
        }
        throw new Error(data.error || 'Failed to book table');
      }

      toast.success('Table booked successfully!');
      // Reset form
      setSelectedTime('');
      setNumberOfPeople(2);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      fetchBookedTimes(selectedDate);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to book table');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book a Table at {restaurantName}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <Label>Available Times</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {AVAILABLE_TIMES.map((time) => (
              <Button
                key={time}
                type="button"
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                disabled={bookedTimes.includes(time)}
                className="w-full"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="people">Number of People</Label>
          <Input
            type="number"
            id="people"
            min="1"
            max="10"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            type="text"
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            type="tel"
            id="phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!selectedTime || isLoading}
        >
          {isLoading ? 'Booking...' : 'Book Table'}
        </Button>
      </form>
    </div>
  );
} 