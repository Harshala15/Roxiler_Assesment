import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation';
import { User, Mail, Lock, MapPin, UserPlus, ArrowLeft } from 'lucide-react';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const addressError = validateAddress(formData.address);
    if (addressError) newErrors.address = addressError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post('/users', formData);
      navigate('/admin/users', { 
        state: { message: 'User created successfully!' }
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user. Please try again.';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserPlus className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
              <p className="text-sm text-gray-600">Create a new user account</p>
            </div>
          </div>
          <Link
            to="/admin/users"
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Users</span>
          </Link>
        </div>
      </div>

      {/* Form to add user */}
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="form-label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`form-input !pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter full name (20-60 characters)"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`form-input !pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`form-input !pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                8-16 characters with at least one uppercase letter and special character
              </p>
            </div>

            <div>
              <label htmlFor="role" className="form-label">
                User Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                className="form-input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">Regular User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="form-label">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="address"
                name="address"
                rows="3"
                required
                className={`form-input !pl-10 ${errors.address ? 'border-red-500' : ''}`}
                placeholder="Enter complete address (max 400 characters)"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating User...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create User</span>
                </>
              )}
            </button>
            <Link
              to="/admin/users"
              className="btn-secondary"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;