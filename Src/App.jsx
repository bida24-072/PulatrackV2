import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Home, List, PieChart, Target, User } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Lock from './pages/Lock';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Legal from './pages/Legal';

const ProtectedRoute = ({ children }) => {
  const { user, isLocked } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (isLocked) return <Navigate to="/lock" />;
  return <Layout>{children}</Layout>;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/transactions', icon: List, label: 'History' },
    { path: '/budgets', icon: PieChart, label: 'Budget' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto shadow-2xl relative bg-white">
      <header className="bg-teal-600 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">PulaTrack</h1>
        <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center font-bold">P</div>
      </header>
      <main className="p-4">{children}</main>
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around p-3 pb-safe z-50">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className={`flex flex-col items-center ${isActive ? 'text-teal-600' : 'text-gray-400'}`}>
              <Icon size={24} className={isActive ? 'mb-1' : 'mb-1'} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/lock" element={<Lock />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/privacy" element={<Legal />} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
