import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Chatbot from './components/chat/Chatbot'
import Login from './pages/Login'
import Register from './pages/Register'
import Rooms from './pages/Rooms'
import RoomDetails from './pages/RoomDetails'
import AdminRooms from './pages/AdminRooms'
import CustomerDashboard from './pages/CustomerDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<div className="flex flex-col items-center justify-center h-[80vh] space-y-6"><h1 className="text-5xl font-extrabold tracking-tight text-primary">Smart Hotel Management System</h1><p className="text-xl text-muted-foreground max-w-2xl text-center">Experience luxury, seamless bookings, and instant service requests all from our modern platform.</p></div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
        </Routes>
      </main>
      <Chatbot />
    </div>
  )
}

export default App
