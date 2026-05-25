import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminRooms = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  
  // Form state
  const [roomNo, setRoomNo] = useState('');
  const [type, setType] = useState('Standard');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
    } else {
      fetchRooms();
    }
  }, [user, navigate]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/rooms');
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/rooms', {
        roomNo, type, price: Number(price), capacity: Number(capacity)
      }, config);
      alert('Room added successfully');
      setRoomNo(''); setPrice(''); setCapacity('');
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding room');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Room Management</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Add New Room</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRoom} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Room No</Label>
                <Input value={roomNo} onChange={(e) => setRoomNo(e.target.value)} required placeholder="101" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={type} onChange={(e) => setType(e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Price per night ($)</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="99" />
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required placeholder="2" />
              </div>
              <Button type="submit" className="md:col-span-4 mt-4">Add Room</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th className="px-6 py-3">Room No</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Capacity</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r._id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{r.roomNo}</td>
                      <td className="px-6 py-4">{r.type}</td>
                      <td className="px-6 py-4">${r.price}</td>
                      <td className="px-6 py-4">{r.capacity}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${r.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rooms.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-4 text-center text-muted-foreground">No rooms found. Add one above.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRooms;
