const { GoogleGenerativeAI } = require('@google/generative-ai');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const chatWithAI = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // 1. Check for authenticated user from authorization header
  let currentUser = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      currentUser = await User.findById(decoded.id).select('-password');
    } catch (err) {
      console.error('Token verification in chat failed:', err.message);
    }
  }

  // 2. Fetch context from DB: Rooms
  let roomSummary = '';
  try {
    const rooms = await Room.find();
    if (rooms && rooms.length > 0) {
      roomSummary = rooms.map(r => 
        `- Room ${r.roomNo} (${r.type}): $${r.price}/night, Capacity: ${r.capacity} guests. Status: ${r.status}. Amenities: ${r.amenities.join(', ')}`
      ).join('\n');
    } else {
      roomSummary = 'No rooms are currently registered in the system.';
    }
  } catch (err) {
    console.error('Failed to fetch rooms for chat:', err.message);
    roomSummary = 'Error fetching room availability.';
  }

  // 3. Fetch context from DB: Bookings & Service Requests (if authenticated)
  let userContext = '';
  if (currentUser) {
    try {
      const bookings = await Booking.find({ user: currentUser._id }).populate('room');
      const serviceRequests = await ServiceRequest.find({ userId: currentUser._id });

      userContext = `\nActive Logged-In Guest Details:
- Name: ${currentUser.name}
- Email: ${currentUser.email}

Their Bookings at our hotel:
${bookings.length > 0 ? bookings.map(b => 
  `- Booking ID: ${b._id}, Room: ${b.room ? b.room.roomNo : 'N/A'} (${b.room ? b.room.type : 'N/A'}), Dates: ${new Date(b.checkInDate).toLocaleDateString()} to ${new Date(b.checkOutDate).toLocaleDateString()}, Booking Status: ${b.bookingStatus}, Payment Status: ${b.paymentStatus}, Total Paid/Due: $${b.totalAmount}`
).join('\n') : '- No bookings found for this user.'}

Their Service Requests (e.g. food, laundry, cleaning):
${serviceRequests.length > 0 ? serviceRequests.map(s => 
  `- Service Type: ${s.serviceType}, Details: ${s.details || 'None'}, Status: ${s.status}`
).join('\n') : '- No service requests found.'}
`;
    } catch (err) {
      console.error('Failed to fetch user bookings/services for chat:', err.message);
    }
  }

  // 4. Check for GEMINI_API_KEY
  if (!process.env.GEMINI_API_KEY) {
    // Elegant fallback if no key is configured
    console.warn('GEMINI_API_KEY is missing. Providing mock assistant response.');
    
    let reply = `[System Notice: GEMINI_API_KEY is not configured in backend .env. Showing real-time data using fallback rules.]\n\n`;
    
    const lower = message.toLowerCase();
    if (lower.includes('room') || lower.includes('price') || lower.includes('suite') || lower.includes('catalog') || lower.includes('avail')) {
      reply += `Here is our current room list:\n${roomSummary}\n\nYou can book any of these on the Rooms page!`;
    } else if (currentUser && (lower.includes('booking') || lower.includes('my check') || lower.includes('reserve') || lower.includes('stay'))) {
      reply += `Here is your active booking information:\n${userContext || 'No bookings found.'}`;
    } else if (currentUser && (lower.includes('service') || lower.includes('request') || lower.includes('food') || lower.includes('laundry') || lower.includes('cleaning'))) {
      reply += `Here are your current request details:\n${userContext || 'No service requests found.'}`;
    } else {
      reply += `Hello ${currentUser ? currentUser.name : 'guest'}! Welcome to Grand Horizon Hotel & Suites. How can I help you today? (Please set GEMINI_API_KEY in the backend's .env file to enable the smart AI model).`;
    }
    return res.status(200).json({ reply });
  }

  // 5. Call Gemini API
  try {
    const systemInstructionText = `You are the AI Concierge for the Grand Horizon Hotel & Suites, a smart luxury hotel.
You are professional, polite, helpful, and speak in a warm, welcoming tone.
If the guest asks about booking rooms, guide them to go to the "Rooms" page.
Here is the real-time information about our hotel's rooms:
${roomSummary}
${currentUser ? userContext : '\nThe user is currently browsing as a Guest (unauthenticated).'}

General Hotel Information:
- Check-in time: 3:00 PM
- Check-out time: 11:00 AM
- Pool hours: 8:00 AM - 10:00 PM
- Breakfast hours: 7:00 AM - 10:00 AM (Served at the Horizon Grill restaurant)
- Shuttle service: Runs every 30 minutes to/from the airport and downtown. Book with front desk.
- Wi-Fi: Connect to 'Horizon_Guest' (no password required, just accept terms).

Keep your answers concise, clear, and focused on helping the guest. Only reference details that are provided here or general common sense hospitality info.`;

    // Format history for Gemini API:
    // Gemini roles must alternate: user, model, user, model...
    const contents = [];
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      recentHistory.forEach(msg => {
        contents.push({
          role: msg.isBot ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstructionText }]
      },
      contents
    })
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(`Google API Error: ${errBody?.error?.message || response.statusText}`);
  }

  const resData = await response.json();
  const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

  return res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error('Gemini API call failed:', error.message);

    // Fallback response when API fails
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('room') || lower.includes('price') || lower.includes('suite') || lower.includes('catalog') || lower.includes('avail')) {
      reply = `Here is our current room list:\n${roomSummary}\n\nYou can book any of these on the Rooms page!`;
    } else if (currentUser && (lower.includes('booking') || lower.includes('my check') || lower.includes('reserve') || lower.includes('stay'))) {
      reply = `Here is your active booking information:\n${userContext || 'No bookings found.'}`;
    } else if (currentUser && (lower.includes('service') || lower.includes('request') || lower.includes('food') || lower.includes('laundry') || lower.includes('cleaning'))) {
      reply = `Here are your current request details:\n${userContext || 'No service requests found.'}`;
    } else if (lower.includes('pool') || lower.includes('wifi') || lower.includes('breakfast') || lower.includes('shuttle') || lower.includes('time') || lower.includes('check') || lower.includes('hour') || lower.includes('guide')) {
      reply = `Here is the Grand Horizon Hotel Guide:
- Check-in time: 3:00 PM
- Check-out time: 11:00 AM
- Pool hours: 8:00 AM - 10:00 PM
- Breakfast: 7:00 AM - 10:00 AM at the Horizon Grill restaurant
- Wi-Fi: Connect to 'Horizon_Guest' (no password required)
- Shuttle: Free shuttle runs to/from the airport every 30 minutes.`;
    } else {
      reply = `Hello ${currentUser ? currentUser.name : 'guest'}! Welcome to Grand Horizon Hotel & Suites. How can I help you today?`;
    }

    return res.status(200).json({ reply });
  }
  // } catch (error) {
  //   console.error('Gemini API call failed:');
  //   console.error(error);
  //   console.error(error.message);

  //   return res.status(500).json({ 
  //     message: 'Failed to communicate with AI chat service',
  //     error: error.message 
  //   });
  // }
};

module.exports = { chatWithAI };
