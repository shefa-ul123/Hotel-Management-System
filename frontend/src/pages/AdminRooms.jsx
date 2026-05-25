import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
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
  const [amenities, setAmenities] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [images, setImages] = useState(null);

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

  const handleSubmitRoom = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      
      const formData = new FormData();
      formData.append('roomNo', roomNo);
      formData.append('type', type);
      formData.append('price', Number(price));
      formData.append('capacity', Number(capacity));
      formData.append('amenities', amenities);
      
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }
      
      if (editingId) {
        await axios.put(`http://localhost:5000/api/rooms/${editingId}`, formData, config);
        toast.success('Room updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/rooms', formData, config);
        toast.success('Room added successfully');
      }
      
      resetForm();
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving room');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:5000/api/rooms/${id}`, config);
        toast.success('Room deleted successfully');
        fetchRooms();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting room');
      }
    }
  };

  const handleEditClick = (room) => {
    setEditingId(room._id);
    setRoomNo(room.roomNo);
    setType(room.type);
    setPrice(room.price);
    setCapacity(room.capacity);
    setAmenities(room.amenities ? room.amenities.join(', ') : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setRoomNo('');
    setPrice('');
    setCapacity('');
    setAmenities('');
    setImages(null);
    if (document.getElementById('images-input')) {
      document.getElementById('images-input').value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Room Management</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Room' : 'Add New Room'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitRoom} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
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
              <div className="space-y-2 md:col-span-2 lg:col-span-2">
                <Label>Amenities (comma separated)</Label>
                <Input value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="TV, WiFi, Air Conditioning" />
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-2">
                <Label>Room Images (max 3)</Label>
                <Input id="images-input" type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
              </div>
              <div className="md:col-span-2 lg:col-span-4 mt-4 flex gap-2">
                <Button type="submit" className="flex-1">{editingId ? 'Update Room' : 'Add Room'}</Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
                )}
              </div>
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
                    <th className="px-6 py-3">Amenities</th>
                    <th className="px-6 py-3">Images</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r._id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{r.roomNo}</td>
                      <td className="px-6 py-4">{r.type}</td>
                      <td className="px-6 py-4">${r.price}</td>
                      <td className="px-6 py-4">{r.capacity}</td>
                      <td className="px-6 py-4 truncate max-w-[200px]" title={r.amenities?.join(', ')}>
                        {r.amenities?.length ? r.amenities.join(', ') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {r.images && r.images.length > 0 ? (
                          <div className="flex -space-x-2 overflow-hidden">
                            {r.images.map((img, i) => (
                              <img key={i} src={img} alt={r.roomNo} className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover" />
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${r.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(r)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(r._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                  {rooms.length === 0 && (
                    <tr><td colSpan="8" className="px-6 py-4 text-center text-muted-foreground">No rooms found. Add one above.</td></tr>
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
