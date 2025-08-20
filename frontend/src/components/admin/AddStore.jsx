import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Store, Mail, MapPin, User, ArrowLeft } from 'lucide-react';

const AddStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    user_id: '' 
  });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const res = await api.get('/users?role=store_owner');
      setOwners(res.data);
    } catch (error) {
      console.error('Failed to fetch store owners', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/stores', formData);
      navigate('/admin/stores', { state: { message: 'Store created successfully!' } });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create store. Please try again.';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Store className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Store</h1>
            <p className="text-sm text-gray-600">Assign a store to a store owner</p>
          </div>
        </div>
        <Link to="/admin/stores" className="btn-secondary flex items-center space-x-2">
          <ArrowLeft size={16} />
          <span>Back to Stores</span>
        </Link>
      </div>

      {/* Form  to add new store*/}
      <div className="bg-white shadow rounded-lg p-6">
        {errors.submit && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{errors.submit}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Store Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">Address</label>
            <textarea name="address" rows="3" required value={formData.address} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">Assign to Store Owner</label>
            <select
              name="user_id"
              required
              value={formData.user_id}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select Store Owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating Store...' : 'Create Store'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
