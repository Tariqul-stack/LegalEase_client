'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import axiosInstance from '@/lib/axios';

function UpdateProfileContent() {
  const [formData, setFormData] = useState({ name: '', photo: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const user = JSON.parse(raw);
          setFormData({ name: user.name || '', photo: user.photo || '' });
        }
      } catch {
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full name is required.');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await axiosInstance.put('/api/users/profile', {
        name: formData.name.trim(),
        photo: formData.photo.trim() || undefined,
      });

      // Update localStorage with new user data
      const updatedUser = res.data?.user || res.data;
      const existing = JSON.parse(localStorage.getItem('user') || '{}');
      const merged = { ...existing, name: updatedUser.name ?? formData.name, photo: updatedUser.photo ?? formData.photo };
      localStorage.setItem('user', JSON.stringify(merged));

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewAvatar =
    formData.photo ||
    (formData.name
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1A3C5E&color=fff&size=128`
      : null);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Update Profile</h1>

      <div className="bg-white rounded-2xl shadow p-8 max-w-lg">
        {/* Avatar Preview */}
        {previewAvatar && (
          <div className="flex justify-center mb-6">
            <img
              src={previewAvatar}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#1A3C5E]/20 shadow"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E]"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="photo">
              Profile Photo URL{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="photo"
              name="photo"
              type="url"
              value={formData.photo}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E]"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {success && (
            <div className="bg-green-50 border border-green-100 text-green-700 text-sm font-medium p-3 rounded-lg">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#1A3C5E] text-white font-semibold rounded-lg hover:bg-[#15304a] disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function UpdateProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <UpdateProfileContent />
    </ProtectedRoute>
  );
}
