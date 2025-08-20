import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Store, Users, Settings, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'user': return '/user/dashboard';
      case 'store_owner': return '/store-owner/dashboard';
      default: return '/login';
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-gradient-to-r from-green-600 to-teal-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link 
              to={getDashboardLink()} 
              className="text-white text-2xl font-extrabold hover:text-gray-200 transition-colors"
            >
              <span className="hidden sm:inline">Store Rating System</span>
              <span className="sm:hidden">SRS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Role-based Links */}
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="nav-link"><Settings size={18} /> Dashboard</Link>
                    <Link to="/admin/users" className="nav-link"><Users size={18} /> Users</Link>
                    <Link to="/admin/stores" className="nav-link"><Store size={18} /> Stores</Link>
                  </>
                )}
                {user?.role === 'user' && (
                  <>
                    <Link to="/user/dashboard" className="nav-link"><Settings size={18} /> Dashboard</Link>
                    <Link to="/user/stores" className="nav-link"><Store size={18} /> Stores</Link>
                    <Link to="/user/profile" className="nav-link"><User size={18} /> Profile</Link>
                  </>
                )}
                {user?.role === 'store_owner' && (
                  <>
                    <Link to="/store-owner/dashboard" className="nav-link"><Settings size={18} /> Dashboard</Link>
                    <Link to="/store-owner/profile" className="nav-link"><User size={18} /> Profile</Link>
                  </>
                )}

                {/* User Info & Logout */}
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-white font-medium hidden lg:inline">Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-3 py-1 rounded-lg transition"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-white hover:text-gray-200 transition">Login</Link>
                <Link
                  to="/register"
                  className="bg-green-500 text-white px-5 py-2 rounded-lg shadow font-semibold hover:bg-green-600 transition-all transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-white hover:text-gray-200 p-2">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-green-600 to-teal-600 border-t border-teal-500 shadow-lg rounded-b-lg mt-1">
            <div className="px-4 pt-4 pb-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="text-white text-sm font-medium px-3 py-2 border-b border-teal-500">
                    Welcome, {user?.name}
                  </div>

                  {/* Role Links */}
                  {user?.role === 'admin' && (
                    <>
                      <Link to="/admin/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}><Settings size={16} /> Dashboard</Link>
                      <Link to="/admin/users" className="mobile-nav-link" onClick={closeMobileMenu}><Users size={16} /> Users</Link>
                      <Link to="/admin/stores" className="mobile-nav-link" onClick={closeMobileMenu}><Store size={16} /> Stores</Link>
                    </>
                  )}
                  {user?.role === 'user' && (
                    <>
                      <Link to="/user/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}><Settings size={16} /> Dashboard</Link>
                      <Link to="/user/stores" className="mobile-nav-link" onClick={closeMobileMenu}><Store size={16} /> Stores</Link>
                      <Link to="/user/profile" className="mobile-nav-link" onClick={closeMobileMenu}><User size={16} /> Profile</Link>
                    </>
                  )}
                  {user?.role === 'store_owner' && (
                    <>
                      <Link to="/store-owner/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}><Settings size={16} /> Dashboard</Link>
                      <Link to="/store-owner/profile" className="mobile-nav-link" onClick={closeMobileMenu}><User size={16} /> Profile</Link>
                    </>
                  )}

                  {/* Logout */}
                  <button
                    onClick={() => { handleLogout(); closeMobileMenu(); }}
                    className="w-full text-left text-white hover:bg-white hover:bg-opacity-20 flex items-center space-x-2 px-3 py-2 rounded-lg transition"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link" onClick={closeMobileMenu}>Login</Link>
                  <Link
                    to="/register"
                    className="bg-green-500 text-white px-5 py-2 rounded-lg shadow font-semibold hover:bg-green-600 transition-all transform hover:scale-105 block text-center"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Extra styles for links */}
      <style>
        {`
          .nav-link {
            @apply text-white hover:text-gray-200 flex items-center space-x-1 px-3 py-2 rounded-lg transition;
          }
          .mobile-nav-link {
            @apply text-white hover:bg-white hover:bg-opacity-20 flex items-center space-x-2 px-3 py-2 rounded-lg transition;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
