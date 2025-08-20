import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation';
import { User, Mail, Lock, MapPin, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
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
      await api.post('/auth/register', formData);
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 bg-white shadow-xl rounded-2xl p-8">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-green-100">
          <UserPlus className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-center">
            {errors.submit}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name (20-60 characters)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full rounded-md border py-2 pl-10 pr-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full rounded-md border py-2 pl-10 pr-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full rounded-md border py-2 pl-10 pr-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            <p className="mt-1 text-xs text-gray-500">
              8-16 characters with at least one uppercase letter and special character
            </p>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="address"
                name="address"
                rows="3"
                required
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                className={`block w-full rounded-md border py-2 pl-10 pr-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center rounded-lg bg-green-600 text-white font-semibold py-2 px-4 shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
);

};

export default Register;