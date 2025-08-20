import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';
import { validatePassword } from '../../utils/validation';
import { User, Lock, Save, Eye, EyeOff, Star } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
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
      const [profileResponse, ratingsResponse] = await Promise.all([
        api.get('/users/profile'),
        api.get('/ratings/user')
      ]);
      setProfile(profileResponse.data);
      setRatings(ratingsResponse.data);
    } catch (error) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    const newPasswordError = validatePassword(passwordForm.newPassword);
    if (newPasswordError) errors.newPassword = newPasswordError;
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
      setError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdating(false);
    }
  };

  const renderStars = (rating) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ));

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-12 py-8 space-y-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl p-8 flex flex-col md:flex-row md:justify-between items-center gap-4 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-lg">
            <User className="h-12 w-12 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Hello, {user?.name}</h1>
            <p className="text-lg text-indigo-100 mt-1">Manage your profile and view your ratings</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 rounded-xl bg-white text-indigo-600 font-semibold shadow hover:bg-indigo-50 transition">Edit Profile</button>
          <button className="px-6 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 transition shadow font-semibold">Settings</button>
        </div>
      </div>

      {/* Messages */}
      {success && <div className="bg-green-50 border border-green-300 text-green-800 px-6 py-4 rounded-2xl shadow">{success}</div>}
      {error && <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-2xl shadow">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Profile Card */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden transform hover:scale-105 transition">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
          </div>
          <div className="p-6 space-y-5">
            {['Name', 'Email', 'Role', 'Address'].map((field, idx) => {
              const value = field === 'Name' ? profile?.name : field === 'Email' ? profile?.email : field === 'Role' ? profile?.role : profile?.address;
              return (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700">{field}</label>
                  <div className={`mt-2 p-4 ${field === 'Role' ? 'inline-flex px-4 py-1 rounded-full bg-green-100 text-green-800 font-medium' : 'bg-gray-50 border border-gray-200 rounded-2xl'}`}>
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Password Card */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden transform hover:scale-105 transition">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {['currentPassword', 'newPassword'].map((field, idx) => {
                const show = field === 'currentPassword' ? showCurrentPassword : showNewPassword;
                const toggle = field === 'currentPassword' ? setShowCurrentPassword : setShowNewPassword;
                const placeholder = field === 'currentPassword' ? 'Current Password' : 'New Password';
                return (
                  <div key={idx} className="relative">
                    <label className="text-sm font-medium text-gray-700">{placeholder}</label>
                    <div className="mt-2 relative">
                      <input
                        type={show ? 'text' : 'password'}
                        name={field}
                        value={passwordForm[field]}
                        onChange={handlePasswordChange}
                        className={`w-full p-4 rounded-2xl border ${passwordErrors[field] ? 'border-red-500' : 'border-gray-300'} pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      <button
                        type="button"
                        onClick={() => toggle(!show)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {show ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {passwordErrors[field] && <p className="text-red-600 mt-1 text-sm">{passwordErrors[field]}</p>}
                  </div>
                );
              })}
              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl flex justify-center items-center space-x-2 disabled:opacity-50 transition"
              >
                {updating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save size={16} />}
                <span>{updating ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">My Ratings ({ratings.length})</h3>
        </div>
        {ratings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Star className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-3 text-lg font-semibold text-gray-900">No ratings yet</h3>
            <p className="text-gray-500 mt-1">Start rating stores to track your activity.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {ratings.map(rating => (
              <div key={rating.id} className="px-6 py-4 hover:bg-gray-50 transition rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900">{rating.store_name}</h4>
                    <div className="flex items-center mt-1 space-x-2">
                      <div className="flex items-center">{renderStars(rating.rating)}</div>
                      <span className="text-sm text-gray-600">{rating.rating}/5</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Rated on {new Date(rating.created_at).toLocaleDateString()}</p>
                    {rating.updated_at !== rating.created_at && (
                      <p className="text-xs text-gray-400">Updated {new Date(rating.updated_at).toLocaleDateString()}</p>
                    )}
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

export default Profile;
