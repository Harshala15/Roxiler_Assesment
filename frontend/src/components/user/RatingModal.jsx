import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, Star } from 'lucide-react';

const RatingModal = ({ store, isOpen, onClose, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    if (isOpen && store) checkExistingRating();
  }, [isOpen, store]);

  const checkExistingRating = async () => {
    try {
      const response = await api.get('/ratings/user');
      const userRatings = response.data;
      const existing = userRatings.find(r => r.store_id === store.id);
      if (existing) {
        setExistingRating(existing);
        setRating(existing.rating);
      }
    } catch (err) {
      console.error('Error checking existing rating:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.post('/ratings', { storeId: store.id, rating });
      onRatingSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const activeRating = hoverRating || rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className="focus:outline-none transform hover:scale-110 transition"
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(i)}
        >
          <Star
            className={`h-10 w-10 transition-colors ${
              i <= activeRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          />
        </button>
      );
    }

    return stars;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-95 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 flex justify-between items-center rounded-t-3xl">
          <h3 className="text-xl font-bold text-white">
            {existingRating ? 'Update Rating' : 'Rate Store'}
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Store Info */}
          <div className="bg-gray-50 rounded-2xl p-4 shadow-inner">
            <h4 className="font-semibold text-gray-900 text-lg">{store.name}</h4>
            <p className="text-gray-600 mt-1 text-sm">{store.address}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl shadow">
              {error}
            </div>
          )}

          {/* Existing Rating */}
          {existingRating && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 shadow-inner">
              <p className="text-sm text-blue-700">
                You previously rated this store {existingRating.rating}/5. Update below.
              </p>
            </div>
          )}

          {/* Rating Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Your Rating
              </label>
              <div className="flex items-center space-x-2 mb-2">{renderStars()}</div>
              <p className="text-sm text-gray-500">
                {rating === 0 && 'Click on stars to rate'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-transform transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {existingRating ? 'Updating...' : 'Submitting...'}
                  </div>
                ) : (
                  existingRating ? 'Update Rating' : 'Submit Rating'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 font-semibold shadow transition-transform transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
