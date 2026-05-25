import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { io } from 'socket.io-client';
import { Bell } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socket = io('http://localhost:5000');
    
    // Listen for events
    socket.on('bookingCreated', (booking) => {
      if (user?.role === 'admin' || user?.role === 'staff') {
        setNotifications(prev => [{ id: Date.now(), message: `New booking created for room ${booking.room}` }, ...prev]);
      }
    });

    socket.on('newServiceRequest', (req) => {
      if (user?.role === 'admin' || user?.role === 'staff') {
        setNotifications(prev => [{ id: Date.now(), message: `New service request: ${req.serviceType}` }, ...prev]);
      }
    });
    
    socket.on('serviceRequestUpdated', (req) => {
      if (user?.role === 'customer' && req.userId === user._id) {
        setNotifications(prev => [{ id: Date.now(), message: `Your service request for ${req.serviceType} is now ${req.status}` }, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-primary tracking-tight">SmartHotel</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to={user?.role === 'admin' || user?.role === 'staff' ? '/admin/rooms' : '/rooms'} className="border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Rooms
              </Link>
              {isAuthenticated && (
                <Link to={user?.role === 'admin' || user?.role === 'staff' ? '/admin/dashboard' : '/dashboard'} className="border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  {user?.role === 'admin' || user?.role === 'staff' ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-1 rounded-full text-muted-foreground hover:text-foreground focus:outline-none relative"
                  >
                    <Bell className="h-6 w-6" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                    )}
                  </button>
                  
                  {showDropdown && (
                    <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="py-1 px-4 max-h-64 overflow-y-auto">
                        <p className="text-sm font-medium border-b pb-2 mb-2">Notifications</p>
                        {notifications.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No new notifications</p>
                        ) : (
                          notifications.map(n => (
                            <p key={n.id} className="text-sm text-muted-foreground py-2 border-b last:border-0">{n.message}</p>
                          ))
                        )}
                        <button onClick={() => setNotifications([])} className="text-xs text-primary mt-2 hover:underline w-full text-center">Clear all</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-3 relative">
                  <span className="text-sm font-medium text-foreground mr-4 hidden md:inline-block">Hi, {user.name}</span>
                  <button onClick={handleLogout} className="text-sm font-medium text-destructive hover:underline">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Login</Link>
                <Link to="/register" className="text-sm font-medium text-primary hover:text-primary/80">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
