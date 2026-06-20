import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51TdvMlBpsOcMx4ErukaADAHG9Yjr6z8plaEvlP61l0S0qNbhT9ZSc524wzySfZEaX8UyMrjOrJqA8F0bq2zuhkzq008Jof2hC4');

const CheckoutForm = ({ bookingId, totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard',
      },
      redirect: 'if_required', // we handle the redirect manually for a smooth SPA experience
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && <div className="text-destructive text-sm font-medium">{errorMessage}</div>}
      <div className="flex justify-start">
        <Button type="submit" className="h-12 px-8 text-lg" disabled={isProcessing || !stripe || !elements}>
          {isProcessing ? 'Processing Payment...' : `Pay $${totalAmount}`}
        </Button>
      </div>
    </form>
  );
};

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [clientSecret, setClientSecret] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error('Authentication session expired. Please log in again.');
      navigate('/login');
      return;
    }

    const fetchBookingAndIntent = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch booking details for amount display (we can use the single booking endpoint)
        const bookingRes = await axios.get(`http://localhost:5000/api/bookings/${id}`, config);
        setBooking(bookingRes.data);

        // Fetch client secret from our backend
        const intentRes = await axios.post('http://localhost:5000/api/payments/create-intent', { bookingId: id }, config);
        setClientSecret(intentRes.data.clientSecret);
        
      } catch (err) {
        toast.error('Failed to initialize payment.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingAndIntent();
  }, [id, token]);

  const handlePaymentSuccess = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Update payment status on the backend
      await axios.post('http://localhost:5000/api/payments/confirm', { bookingId: id }, config);
      toast.success('Payment successful! Your reservation is confirmed.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Payment succeeded, but failed to update booking status.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-xl font-medium animate-pulse text-primary">Initializing Secure Checkout...</div>;
  if (!clientSecret || !booking) return <div className="text-center py-20 text-destructive">Checkout initialization failed.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex justify-center items-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
        <Card className="shadow-2xl border-primary/20">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
            <p className="text-muted-foreground mb-8">
              Complete your payment for <span className="font-semibold text-foreground">{booking.room?.type} Room</span>
            </p>
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <CheckoutForm bookingId={id} totalAmount={booking.totalAmount} onSuccess={handlePaymentSuccess} />
            </Elements>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Checkout;
