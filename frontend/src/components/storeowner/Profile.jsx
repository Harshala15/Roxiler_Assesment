import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';
import { validatePassword } from '../../utils/validation';
import { User, Lock, Save, Eye, EyeOff, Store, Star, BarChart3, Mail, MapPin } from 'lucide-react';

const StoreOwnerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileResponse, storesResponse] = await Promise.all([
        api.get('/users/profile'),
        api.get('/stores/owner')
      ]);

      setProfile(profileResponse.data);
      setStores(storesResponse.data);
    } catch (error) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    const newPasswordError = validatePassword(passwordForm.newPassword);
    if (newPasswordError) {
      errors.newPassword = newPasswordError;
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/users/password', passwordForm);
      setSuccess('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password';
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const calculateOverallStats = () => {
    if (stores.length === 0) return { totalRatings: 0, averageRating: 0 };
    
    const totalRatings = stores.reduce((sum, store) => sum + parseInt(store.total_ratings), 0);
    const averageRating = stores.reduce((sum, store) => sum + parseFloat(store.average_rating), 0) / stores.length;
    
    return { totalRatings, averageRating };
  };

  if (loading) return <Loading message="Loading profile..." />;

  const stats = calculateOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Store Owner Profile</h1>
            <p className="text-sm text-gray-600">Manage your account and view your store performance</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Stores
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stores.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Reviews
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalRatings}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Rating
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                {profile?.name}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                {profile?.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <div className="mt-1">
                <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  Store Owner
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                {profile?.address}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="form-label">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    className={`form-input !pl-10 pr-10 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    className={`form-input !pl-10 pr-10 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  8-16 characters with at least one uppercase letter and special character
                </p>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* My Stores */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            My Stores ({stores.length})
          </h3>
        </div>

        {stores.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stores assigned</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any stores assigned to your account yet. Contact an administrator to add stores.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {stores.map((store) => (
              <div key={store.id} className="px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {store.name}
                    </h4>
                    <div className="flex items-center space-x-1 mb-3">
                      {renderStars(parseFloat(store.average_rating))}
                      <span className="text-sm text-gray-600 ml-2">
                        {parseFloat(store.average_rating).toFixed(1)} 
                        ({store.total_ratings} {store.total_ratings === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{store.email}</span>
                      </div>
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-3">{store.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="text-3xl font-bold text-gray-900">
                      {parseFloat(store.average_rating).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">Average Rating</div>
                    <div className="mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parseFloat(store.average_rating) >= 4 
                          ? 'bg-green-100 text-green-800'
                          : parseFloat(store.average_rating) >= 3 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {parseFloat(store.average_rating) >= 4 
                          ? 'Excellent'
                          : parseFloat(store.average_rating) >= 3 
                            ? 'Good' 
                            : 'Needs Improvement'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {store.total_ratings} Reviews
                    </div>
                  </div>
                </div>
                
                {/* Performance Bar */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Performance Score</span>
                    <span className="font-medium text-gray-900">
                      {((parseFloat(store.average_rating) / 5) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        parseFloat(store.average_rating) >= 4 
                          ? 'bg-green-600' 
                          : parseFloat(store.average_rating) >= 3 
                            ? 'bg-yellow-600' 
                            : 'bg-red-600'
                      }`}
                      style={{ width: `${(parseFloat(store.average_rating) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Store Details */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Store ID:</span> {store.id}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(store.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Insights */}
      {stores.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Performance Insights
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  You own <span className="font-semibold">{stores.length}</span> {stores.length === 1 ? 'store' : 'stores'} with 
                  a total of <span className="font-semibold">{stats.totalRatings}</span> customer reviews.
                </p>
                <p>
                  Your overall average rating is <span className="font-semibold">{stats.averageRating.toFixed(1)}/5</span>.
                  {stats.averageRating >= 4 && ' 🎉 Excellent work maintaining high customer satisfaction!'}
                  {stats.averageRating >= 3 && stats.averageRating < 4 && ' 👍 Good performance - consider ways to enhance customer experience.'}
                  {stats.averageRating < 3 && ' 📈 Focus on improving customer satisfaction to boost ratings.'}
                </p>
                {stores.length > 1 && (
                  <p className="pt-2 border-t border-blue-200">
                    <span className="font-medium">Top performing store:</span> {
                      stores.reduce((prev, current) => 
                        parseFloat(prev.average_rating) > parseFloat(current.average_rating) ? prev : current
                      ).name
                    } ({
                      stores.reduce((prev, current) => 
                        parseFloat(prev.average_rating) > parseFloat(current.average_rating) ? prev : current
                      ).average_rating
                    }/5)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerProfile;