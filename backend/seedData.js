require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Room = require('./models/Room');

const seedRooms = [
  {
    roomNo: '101',
    type: 'Standard',
    price: 100,
    capacity: 2,
    amenities: ['TV', 'WiFi', 'Air Conditioning'],
    description: 'A cozy standard room perfect for couples or solo travelers.',
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800']
  },
  {
    roomNo: '102',
    type: 'Deluxe',
    price: 150,
    capacity: 3,
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View'],
    description: 'Spacious deluxe room with premium amenities and beautiful views.',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800']
  },
  {
    roomNo: '201',
    type: 'Suite',
    price: 300,
    capacity: 4,
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View', 'Jacuzzi', 'Kitchenette'],
    description: 'Luxury suite featuring a separate living area, premium furnishings, and an in-room jacuzzi.',
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800']
  },
  {
    roomNo: '202',
    type: 'Standard',
    price: 100,
    capacity: 2,
    amenities: ['TV', 'WiFi', 'Air Conditioning'],
    description: 'A comfortable standard room with modern decor.',
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800']
  }
];

const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing rooms
    await Room.deleteMany();
    
    // Insert seed rooms
    await Room.insertMany(seedRooms);
    
    console.log('Room data successfully imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
