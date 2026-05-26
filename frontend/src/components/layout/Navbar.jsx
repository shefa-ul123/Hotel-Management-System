import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { io } from 'socket.io-client';
import { 
  Bell, 
  Hotel, 
  Sparkles, 
  LogOut, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  // Scroll Listener for premium transparent to glass backdrop morph
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preserved original socket notification handlers
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
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
    setMobileMenuOpen(false);
    navigate('/');
  };

  // Nav links calculation based on authentication & roles
  const getNavLinks = () => {
    const links = [
      { name: 'Rooms', path: user?.role === 'admin' || user?.role === 'staff' ? '/admin/rooms' : '/rooms' }
    ];
    if (isAuthenticated) {
      links.push({
        name: user?.role === 'admin' || user?.role === 'staff' ? 'Admin Dashboard' : 'My Dashboard',
        path: user?.role === 'admin' || user?.role === 'staff' ? '/admin/dashboard' : '/dashboard'
      });
    }
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-500 border-b select-none ${
      scrolled 
        ? 'bg-slate-950/80 backdrop-blur-xl border-violet-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] py-3' 
        : 'bg-slate-950/30 backdrop-blur-sm border-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          
          {/* LEFT: BRAND ANIMATED LOGO & NAVIGATION CAPSULES */}
          <div className="flex items-center gap-8">
            
            {/* Animated & Glowing Hotel Brand Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              {/* Brand Icon with 3D Rotate Spring & Hover Pulse Glow */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 220, damping: 12 }}
                className="relative p-2 rounded-xl border border-violet-500/20 bg-violet-950/40 text-violet-400 flex items-center justify-center overflow-hidden group-hover:border-violet-500/40 group-hover:bg-violet-950/60 shadow-[0_0_15px_rgba(139,92,246,0.15)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all duration-300"
              >
                {/* Secondary Sparkle Icon overlay */}
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute -top-0.5 -right-0.5 text-cyan-300"
                >
                  <Sparkles className="h-3 w-3" />
                </motion.div>
                
                <Hotel className="h-5 w-5 group-hover:text-cyan-300 transition-colors duration-300" />
              </motion.div>

              {/* Logo Text with Gradient styling */}
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 group-hover:brightness-110 transition-all duration-300">
                SmartHotel
              </span>
            </Link>

            {/* Desktop Navigation Link Capsules */}
            <div className="hidden md:flex items-center gap-1">
              <AnimatePresence>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300"
                    >
                      {/* Spring animated background bubble indicator */}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavBubble"
                          className="absolute inset-0 bg-violet-500/20 border border-violet-500/40 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.25),inset_0_0_10px_rgba(139,92,246,0.3)]"
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        />
                      )}
                      
                      <span className={`relative z-10 transition-colors duration-300 ${
                        isActive 
                          ? 'text-violet-100 font-extrabold shadow-sm' 
                          : 'text-slate-200 hover:text-violet-300 font-medium'
                      }`}>
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
          
          {/* RIGHT: NOTIFICATIONS, PROFILE AVATAR, & AUTHENTICATION PILLS */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Dark/Light Mode Toggler */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-300 border border-slate-200 dark:border-violet-500/25 bg-slate-100/60 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-900/90 shadow-[0_0_10px_rgba(139,92,246,0.05)] dark:shadow-[0_0_10px_rgba(139,92,246,0.15)] cursor-pointer relative transition-all duration-300 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5 text-indigo-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5 text-amber-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Pulsating Bell Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 rounded-xl text-slate-200 hover:text-violet-300 border border-violet-500/25 bg-slate-900/60 hover:bg-slate-900/90 shadow-[0_0_10px_rgba(139,92,246,0.15)] hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer relative transition-all duration-300"
                >
                  <motion.div
                    animate={notifications.length > 0 ? { rotate: [0, 15, -15, 10, -10, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                  >
                    <Bell className="h-5 w-5 filter drop-shadow-[0_0_3px_rgba(139,92,246,0.3)]" />
                  </motion.div>
                  
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-rose-500 border border-slate-950 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                  )}
                </motion.button>
                
                {/* Glassmorphic Dropdown Drawer */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50 p-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notifications</p>
                        {notifications.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold">
                            {notifications.length} New
                          </span>
                        )}
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-slate-500 text-xs">
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={n.id} 
                              className="text-xs text-slate-300 p-2.5 rounded-xl bg-white/5 border border-white/5 leading-relaxed hover:border-violet-500/20 transition-all duration-200"
                            >
                              {n.message}
                            </motion.div>
                          ))
                        )}
                      </div>
                      
                      {notifications.length > 0 && (
                        <button 
                          onClick={() => setNotifications([])} 
                          className="text-xs text-violet-400 font-bold hover:text-violet-300 mt-3 block w-full text-center hover:underline cursor-pointer py-1 border-t border-white/5 pt-2"
                        >
                          Clear All Notifications
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Authenticated Profile Info with Glass Badge */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3.5 pl-2">
                
                {/* Glowing Avatar Capsule */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10 bg-slate-900/50 shadow-inner">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-[11px] font-black text-white capitalize shadow-md">
                      {user.name.charAt(0)}
                    </div>
                    {/* Active/Online indicator */}
                    <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950 shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200 select-none">
                    {user.name}
                  </span>
                </div>

                {/* Logout Action Pill */}
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-rose-500/30 text-rose-300 bg-rose-500/10 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_0_15px_rgba(244,63,94,0.45)] transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5 filter drop-shadow-[0_0_2px_rgba(244,63,94,0.3)]" />
                  <span>Logout</span>
                </button>

              </div>
            ) : (
              // Unauthenticated Actions (Login & glowing Sign Up)
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="text-sm font-bold text-slate-200 hover:text-violet-300 bg-white/5 hover:bg-white/10 px-4.5 py-2.5 rounded-full border border-white/10 hover:border-violet-500/25 shadow-sm transition-all duration-300"
                >
                  Login
                </Link>
                
                <Button 
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-full px-5 py-5.5 shadow-[0_0_20px_rgba(139,92,246,0.35)] border-0 cursor-pointer transition-all hover:scale-105"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

          </div>

          {/* HAMBURGER TOGGLE BUTTON FOR MOBILE */}
          <div className="md:hidden flex items-center gap-3">
            
            {/* Mobile Dark/Light Mode Toggler */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-300 border border-slate-200 dark:border-violet-500/20 bg-slate-100/60 dark:bg-slate-900/60 shadow-sm cursor-pointer relative transition-all duration-300 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="moon-mobile"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-4.5 w-4.5 text-indigo-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun-mobile"
                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4.5 w-4.5 text-amber-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Pulsating Bell for authenticated mobile view */}
            {isAuthenticated && notifications.length > 0 && (
              <button 
                onClick={() => { setMobileMenuOpen(true); setShowDropdown(true); }}
                className="p-1.5 rounded-xl text-slate-200 relative border border-violet-500/20 bg-slate-900/60 shadow-[0_0_8px_rgba(139,92,246,0.15)]"
              >
                <Bell className="h-5 w-5 text-violet-400 animate-bounce" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-950 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-900/90 border border-violet-500/20 cursor-pointer focus:outline-none transition-all duration-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE FULL-SCREEN SLIDE-DOWN DRAWER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-slate-950/98 backdrop-blur-2xl shadow-2xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              
              {/* Mobile Profile Banner */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-sm font-black text-white">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white leading-none">{user.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-1 capitalize font-medium">{user.role}</p>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <div className="space-y-1.5 flex flex-col">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center transition-all duration-300 ${
                        isActive 
                          ? 'bg-violet-500/20 border border-violet-500/40 text-violet-100 shadow-[0_0_12px_rgba(139,92,246,0.15)]' 
                          : 'text-slate-200 hover:text-violet-300 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Notifications dropdown block */}
              {isAuthenticated && showDropdown && (
                <div className="p-3.5 rounded-2xl border border-white/5 bg-slate-900/60 space-y-2">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Alerts</p>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500">No new notifications</p>
                  ) : (
                    notifications.map(n => (
                      <p key={n.id} className="text-xs text-slate-300 py-1.5 border-b border-white/5 last:border-0">{n.message}</p>
                    ))
                  )}
                </div>
              )}

              {/* Mobile Actions Drawer Footer */}
              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3.5 rounded-xl border border-rose-500/30 text-rose-300 bg-rose-500/10 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_0_15px_rgba(244,63,94,0.35)] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out from System</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3.5 rounded-xl border border-white/20 text-slate-100 hover:text-violet-300 bg-slate-900/60 text-center font-bold text-sm transition-colors duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-center font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
