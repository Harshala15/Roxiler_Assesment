import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../common/Loading';
import { useAuth } from '../../context/AuthContext';
import { Star, Store, User, TrendingUp } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    totalStores: 0
  });
  const [recentRatings, setRecentRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ratingsResponse, storesResponse] = await Promise.all([
        api.get('/ratings/user'),
        api.get('/stores')
      ]);

      const userRatings = ratingsResponse.data;
      const allStores = storesResponse.data;

      setStats({
        totalRatings: userRatings.length,
        averageRating: userRatings.length > 0
          ? userRatings.reduce((sum, rating) => sum + rating.rating, 0) / userRatings.length
          : 0,
        totalStores: allStores.length
      });

      setRecentRatings(userRatings.slice(0, 5));
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row md:justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-indigo-100 mt-1">Explore and rate amazing stores near you</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/user/stores" className="px-5 py-2 rounded-xl bg-white text-indigo-600 font-semibold shadow hover:bg-indigo-50 transition">Browse Stores</Link>
          <Link to="/user/profile" className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 transition shadow font-semibold">My Profile</Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-lg shadow">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Star className="h-6 w-6 text-yellow-500" />, label: 'My Ratings', value: stats.totalRatings, color: 'yellow' },
          { icon: <TrendingUp className="h-6 w-6 text-green-500" />, label: 'Average Rating', value: stats.averageRating.toFixed(1), color: 'green' },
          { icon: <Store className="h-6 w-6 text-blue-500" />, label: 'Available Stores', value: stats.totalStores, color: 'blue', link: '/user/stores' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4">
              {card.icon}
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{card.label}</h4>
                <p className="text-2xl font-bold mt-1 text-gray-900">{card.value}</p>
              </div>
            </div>
            {card.link && (
              <div className={`mt-4 text-${card.color}-500 font-semibold`}>
                <Link to={card.link} className="hover:underline">View Details</Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Ratings */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Recent Ratings</h3>
          <Link to="/user/stores" className="text-blue-600 font-medium hover:text-blue-500">View all</Link>
        </div>

        {recentRatings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Star className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-semibold text-gray-900">No ratings yet</h3>
            <p className="mt-1 text-gray-500">Start rating stores to see your activity here.</p>
            <div className="mt-6">
              <Link to="/user/stores" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition">Rate Your First Store</Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentRatings.map((rating) => (
              <div key={rating.id} className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{rating.store_name}</h4>
                  <div className="flex items-center mt-1 gap-1">
                    {renderStars(rating.rating)}
                    <span className="ml-2 text-sm text-gray-600">{rating.rating}/5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{new Date(rating.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
