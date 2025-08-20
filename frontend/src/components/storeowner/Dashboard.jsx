import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../common/Loading';
import { Store, Star, BarChart3, MapPin, Mail } from 'lucide-react';

const StoreOwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      const response = await api.get('/stores/owner');
      setStores(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your store statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading your stores..." />;

  const totalStores = stores.length;
  const totalRatings = stores.reduce((sum, s) => sum + (s.total_ratings || 0), 0);
  const avgRating = totalRatings > 0
    ? (stores.reduce((sum, s) => sum + (parseFloat(s.average_rating) || 0) * (s.total_ratings || 0), 0) / totalRatings).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 px-4 py-6 md:px-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Store className="h-10 w-10 text-white" />
          <div>
            <h1 className="text-3xl font-bold">My Store Dashboard</h1>
            <p className="text-gray-200 text-sm md:text-base">Overview of your stores and performance</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-lg shadow">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow flex items-center space-x-4">
          <Store className="h-8 w-8 text-purple-500" />
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Stores</dt>
            <dd className="text-2xl font-bold text-gray-900">{totalStores}</dd>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow flex items-center space-x-4">
          <Star className="h-8 w-8 text-yellow-400" />
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Ratings</dt>
            <dd className="text-2xl font-bold text-gray-900">{totalRatings}</dd>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow flex items-center space-x-4">
          <BarChart3 className="h-8 w-8 text-blue-500" />
          <div>
            <dt className="text-sm font-medium text-gray-500">Average Rating</dt>
            <dd className="text-2xl font-bold text-gray-900">{avgRating}</dd>
          </div>
        </div>
      </div>

      {/* List of Stores */}
      <div className="bg-white shadow-lg rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            My Stores ({stores.length})
          </h3>
        </div>

        {stores.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Store className="mx-auto h-14 w-14 text-gray-300" />
            <h3 className="mt-3 text-lg font-semibold text-gray-900">No stores assigned</h3>
            <p className="mt-1 text-gray-500">An admin needs to assign you a store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow"
              >
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{store.name}</h4>
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {parseFloat(store.average_rating).toFixed(1)} ({store.total_ratings} reviews)
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    {store.email}
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <span className="line-clamp-2">{store.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
