import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createBooking, resetBookingState } from '@/features/bookings/bookingSlice';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.bookings);
  
  const [room, setRoom] = useState(null);
  const [fetching, setFetching] = useState(true);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  
  useEffect(() => {
    const getRoom = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    getRoom();
  }, [id]);

  useEffect(() => {
    if (success) {
      alert('Booking successful!');
      dispatch(resetBookingState());
      navigate('/dashboard'); // redirect to dashboard later
    }
  }, [success, navigate, dispatch]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates.');
      return;
    }
    
    // Calculate simple total amount (1 day if same day selected for simplicity)
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) diffDays = 1;
    
    const totalAmount = diffDays * room.price;

    dispatch(createBooking({
      room: id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount
    }));
  };

  if (fetching) return <div className="text-center py-20">Loading room details...</div>;
  if (!room) return <div className="text-center py-20 text-destructive">Room not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8">
          
          {/* Image & Info */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <img 
                src={room.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000'} 
                alt={room.type} 
                className="w-full h-80 object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{room.type} Room <span className="text-lg font-medium text-muted-foreground ml-2">#{room.roomNo}</span></h1>
              <p className="text-xl text-primary font-semibold mb-4 flex items-center gap-3">
                ${room.price} <span className="text-sm text-muted-foreground font-normal">/ night</span>
                {room.surgeActive && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium flex items-center">High Demand 🔥</span>
                )}
                {room.discountActive && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium flex items-center">Special Discount 💸</span>
                )}
                {(room.surgeActive || room.discountActive) && (
                  <span className="text-sm line-through text-muted-foreground">${room.originalPrice}</span>
                )}
              </p>
              <p className="text-muted-foreground leading-relaxed">{room.description || 'A beautiful room tailored for comfort and luxury.'}</p>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities?.map((am, i) => (
                    <span key={i} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">{am}</span>
                  ))}
                  {(!room.amenities || room.amenities.length === 0) && <span className="text-muted-foreground text-sm">Standard amenities included.</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div>
            <Card className="sticky top-8 shadow-2xl border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Reserve your stay</h3>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Input id="checkIn" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Input id="checkOut" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                  </div>
                  
                  {error && <div className="text-destructive text-sm font-medium">{error}</div>}
                  
                  <div className="pt-4 border-t mt-6">
                    <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                      {loading ? 'Processing...' : 'Confirm Reservation'}
                    </Button>
                    {!isAuthenticated && <p className="text-xs text-center text-muted-foreground mt-2">You will be redirected to login first.</p>}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default RoomDetails;
