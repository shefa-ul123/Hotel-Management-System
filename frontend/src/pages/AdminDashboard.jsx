import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [analytics, setAnalytics] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [analyticsRes, servicesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/analytics', config),
        axios.get('http://localhost:5000/api/services', config)
      ]);
      setAnalytics(analyticsRes.data);
      setServiceRequests(servicesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateServiceStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/services/${id}`, { status }, config);
      fetchData(); // refresh data
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (!analytics) return <div className="text-center py-20">Loading admin dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin & Staff Dashboard</h1>
        
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${analytics.totalRevenue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">Occupancy Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.occupancyRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">Active Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.activeServiceRequests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart & Active Services */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                    <Bar dataKey="total" fill="#aa3bff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {serviceRequests.length === 0 && <p className="text-muted-foreground">No service requests.</p>}
                {serviceRequests.map(req => (
                  <div key={req._id} className="border p-4 rounded-lg bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{req.serviceType}</h4>
                        <p className="text-xs text-muted-foreground">Room: {req.bookingId?.room?.roomNo} | User: {req.userId?.name}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${req.status === 'Requested' ? 'bg-red-100 text-red-800' : req.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {req.status}
                      </span>
                    </div>
                    {req.details && <p className="text-sm mb-3 text-muted-foreground">{req.details}</p>}
                    
                    {req.status !== 'Completed' && req.status !== 'Cancelled' && (
                      <div className="flex gap-2 mt-2">
                        {req.status === 'Requested' && (
                          <Button size="sm" variant="outline" onClick={() => handleUpdateServiceStatus(req._id, 'Assigned')}>Assign</Button>
                        )}
                        {req.status === 'Assigned' && (
                          <Button size="sm" onClick={() => handleUpdateServiceStatus(req._id, 'Completed')}>Complete</Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
