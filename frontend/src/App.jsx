import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/Dashboard';
import UserDashboard from './components/user/Dashboard';
import StoreOwnerDashboard from './components/storeowner/Dashboard';
import UserList from './components/admin/UserList';
import StoreList from './components/admin/StoreList';
import AddUser from './components/admin/AddUser';
import UserStoreList from './components/user/StoreList';
import Profile from './components/user/Profile';
import StoreOwnerProfile from './components/storeowner/Profile';
import AddStore from './components/admin/AddStore';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/add-store" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddStore />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/stores" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StoreList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/add-user" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddUser />
                  </ProtectedRoute>
                } 
              />
              
              {/* User Routes */}
              <Route 
                path="/user/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user/stores" 
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserStoreList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user/profile" 
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Store Owner Routes */}
              <Route 
                path="/store-owner/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['store_owner']}>
                    <StoreOwnerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/store-owner/profile" 
                element={
                  <ProtectedRoute allowedRoles={['store_owner']}>
                    <StoreOwnerProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/store-owner/dashboard" 
                element={
                  <ProtectedRoute>
                    <StoreOwnerDashboard />
                  </ProtectedRoute>
                } />

              
              {/* Default Redirects */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;