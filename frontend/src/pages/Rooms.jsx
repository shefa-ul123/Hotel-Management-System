import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms } from '@/features/rooms/roomSlice';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Rooms = () => {
  const dispatch = useDispatch();
  const { rooms, loading, error } = useSelector((state) => state.rooms);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    if (capacity) params.capacity = capacity;
    if (type) params.type = type;
    dispatch(fetchRooms(params));
  };

  // If there's no backend data yet, we can show some premium placeholders (or wait for the real data)
  // We'll use a mix of real data and fallback images since images are not implemented yet.

  const renderRooms = () => {
    if (loading) return <div className="text-center py-20 text-xl font-medium animate-pulse text-primary">Loading premium suites...</div>;
    if (error) return <div className="text-center py-20 text-destructive">{error}</div>;
    if (!rooms || rooms.length === 0) return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-2xl mb-4">No rooms available at the moment.</p>
        <p>Please check back later or contact our support.</p>
      </div>
    );

    return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {rooms.map((room) => (
          <motion.div key={room._id} variants={item} whileHover={{ y: -5 }}>
            <Card className="overflow-hidden border-0 shadow-2xl bg-card/50 backdrop-blur-sm transition-all hover:shadow-primary/20">
              <div className="relative h-64 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img 
                  src={room.images?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000'} 
                  alt={room.type} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-2xl font-bold text-white mb-1">{room.type} Room</h3>
                  <span className="inline-block px-3 py-1 bg-primary/80 backdrop-blur-md text-primary-foreground text-xs font-semibold rounded-full">
                    {room.status}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-light text-foreground">${room.price}<span className="text-sm text-muted-foreground font-normal">/night</span></span>
                  <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">Up to {room.capacity} Guests</span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {room.description || "Experience luxury and comfort in our meticulously designed rooms. Perfect for your next getaway."}
                </p>
                
                {room.amenities?.length > 0 && (
                   <div className="mt-4 flex flex-wrap gap-2">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{amenity}</span>
                      ))}
                      {room.amenities.length > 3 && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">+{room.amenities.length - 3} more</span>}
                   </div>
                )}
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full h-12 text-lg shadow-lg shadow-primary/30" disabled={room.status !== 'Available'} asChild={room.status === 'Available'}>
                   {room.status === 'Available' ? <Link to={`/rooms/${room._id}`}>Book Now</Link> : <span>Unavailable</span>}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950">
      {/* Premium Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-950 z-10"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 text-center px-4 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:to-purple-400">
            Discover Luxury
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Find the perfect space for your next unforgettable experience.
          </p>
        </motion.div>
      </div>

      {/* Search Bar Section */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-30">
        <Card className="bg-background/80 backdrop-blur-xl border border-primary/20 shadow-2xl p-6 rounded-2xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in</Label>
              <Input id="checkIn" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out</Label>
              <Input id="checkOut" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Guests</Label>
              <Input id="capacity" type="number" min="1" placeholder="e.g. 2" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <select 
                id="type" 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All Types</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div className="md:pt-8">
              <Button type="submit" className="w-full h-10 text-md shadow-md shadow-primary/20">Search</Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        {renderRooms()}
      </div>
    </div>
  );
};

export default Rooms;
