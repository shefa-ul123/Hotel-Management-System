import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const CustomerDashboard = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [serviceType, setServiceType] = useState('Food');
  const [serviceDetails, setServiceDetails] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/bookings', config);
        setBookings(data);
        if (data.length > 0) setSelectedBookingId(data[0]._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, [isAuthenticated, navigate, token]);

  const handleRequestService = async (e) => {
    e.preventDefault();
    if (!selectedBookingId) return alert('No active booking selected.');
    
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/services', {
        bookingId: selectedBookingId,
        serviceType,
        details: serviceDetails
      }, config);
      alert('Service requested successfully!');
      setServiceDetails('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting service');
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/payments/mock', {
        bookingId, paymentMethod: 'Card'
      }, config);
      alert('Payment successful!');
      
      // Update local state to reflect payment
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, paymentStatus: 'Paid' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing payment');
    }
  };

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your bookings and request services here.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-muted-foreground">You have no bookings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card">
                        <div>
                          <p className="font-semibold text-lg">{booking.room?.type} Room <span className="text-sm font-normal text-muted-foreground">#{booking.room?.roomNo}</span></p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-medium mt-1">Total: ${booking.totalAmount}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 text-right flex flex-col gap-2">
                           <span className={`px-3 py-1 text-xs font-semibold rounded-full text-center ${booking.bookingStatus === 'Confirmed' ? 'bg-blue-100 text-blue-800' : booking.bookingStatus === 'CheckedIn' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {booking.bookingStatus}
                           </span>
                           <span className={`px-3 py-1 text-xs font-semibold rounded-full text-center ${booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            Payment: {booking.paymentStatus}
                           </span>
                           {booking.paymentStatus !== 'Paid' && (
                             <Button size="sm" className="mt-1" onClick={() => handlePayment(booking._id)}>Pay Now</Button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8 shadow-xl border-primary/10">
              <CardHeader>
                <CardTitle>Request Service</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestService} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Booking</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedBookingId} onChange={(e) => setSelectedBookingId(e.target.value)}
                      required
                    >
                      {bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'CheckedIn').map(b => (
                        <option key={b._id} value={b._id}>{b.room?.type} Room (In: {new Date(b.checkInDate).toLocaleDateString()})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="Food">Food Delivery</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Laundry">Laundry</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Details</Label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="e.g. Need extra towels, or 2 burgers..."
                      value={serviceDetails}
                      onChange={(e) => setServiceDetails(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={!selectedBookingId}>Submit Request</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
