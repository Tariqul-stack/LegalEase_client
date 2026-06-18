'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const EMPTY_FORM = {
  name: '',
  bio: '',
  specialization: '',
  consultationFee: '',
  photo: '',
  status: 'available',
};

export default function ManageLegalProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // existing lawyer doc or null
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ── On mount: load user + fetch existing lawyer profile ───────────────────
  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/api/lawyers');
        const all = Array.isArray(res.data) ? res.data : [];
        // Find the profile that belongs to this user
        const mine = all.find(
          (l) => l.userId === storedUser?._id || l.userId === storedUser?.id
        );
        if (mine) {
          setProfile(mine);
          setFormData({
            name: mine.name || storedUser?.name || '',
            bio: mine.bio || '',
            specialization: mine.specialization || '',
            consultationFee: mine.consultationFee ?? '',
            photo: mine.photo || storedUser?.photo || '',
            status: mine.status || 'available',
          });
        } else {
          // No profile yet — prefill name/email from stored user
          setFormData((prev) => ({
            ...prev,
            name: storedUser?.name || '',
            photo: storedUser?.photo || '',
          }));
        }
      } catch {
        // If endpoint fails, treat as no profile
        setFormData((prev) => ({
          ...prev,
          name: storedUser?.name || '',
          photo: storedUser?.photo || '',
        }));
      } finally {
        setLoading(false);
      }
    };

    if (storedUser) fetchProfile();
    else setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.specialization.trim()) {
      setError('Name and Specialization are required.');
      return;
    }

    setSaving(true);
    setSuccess('');
    setError('');

    const payload = {
      name: formData.name.trim(),
      bio: formData.bio.trim(),
      specialization: formData.specialization.trim(),
      consultationFee: formData.consultationFee ? Number(formData.consultationFee) : undefined,
      photo: formData.photo.trim() || undefined,
      status: formData.status,
      // Include email when creating
      ...(!profile && { email: user?.email }),
    };

    try {
      let res;
      if (profile) {
        res = await axiosInstance.put(`/api/lawyers/${profile._id}`, payload);
        setProfile((prev) => ({ ...prev, ...res.data }));
        setSuccess('Legal profile updated successfully!');
      } else {
        res = await axiosInstance.post('/api/lawyers', payload);
        setProfile(res.data);
        setSuccess('Legal profile created successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const previewAvatar =
    formData.photo ||
    (formData.name
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1A3C5E&color=fff&size=128`
      : null);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Manage Legal Profile</h1>
        <div className="bg-white rounded-2xl shadow p-8 max-w-2xl animate-pulse space-y-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-extrabold text-gray-800">Manage Legal Profile</h1>
        {profile ? (
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Profile Active
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            No Profile Yet
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {profile
          ? 'Update your professional legal profile visible to clients.'
          : 'Create your lawyer profile so clients can discover and hire you.'}
      </p>

      <div className="bg-white rounded-2xl shadow p-8 max-w-2xl">
        {/* Avatar Preview */}
        {previewAvatar && (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={previewAvatar}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#1A3C5E]/20 shadow"
              />
              <span
                className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                  formData.status === 'available' ? 'bg-green-500' : 'bg-red-400'
                }`}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
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
              placeholder="Your full professional name"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="specialization">
              Specialization <span className="text-red-500">*</span>
            </label>
            <input
              id="specialization"
              name="specialization"
              type="text"
              required
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E]"
              placeholder="e.g. Criminal Law, Corporate Law"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bio">
              Bio / About
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E] resize-none"
              placeholder="Briefly describe your legal expertise and experience…"
            />
          </div>

          {/* Consultation Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="consultationFee">
              Consultation Fee ($/hr)
            </label>
            <input
              id="consultationFee"
              name="consultationFee"
              type="number"
              min="0"
              value={formData.consultationFee}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E]"
              placeholder="e.g. 150"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="photo">
              Profile Photo URL{' '}
              <span className="text-gray-400 font-normal">(imgBB upload coming soon)</span>
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

          {/* Status Toggle */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Availability Status</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, status: 'available' }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                  formData.status === 'available'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                ● Available
              </button>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, status: 'busy' }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                  formData.status === 'busy'
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                ● Busy
              </button>
            </div>
          </div>

          {/* Feedback */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[#1A3C5E] text-white font-semibold rounded-lg hover:bg-[#15304a] disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : profile ? (
              'Update Profile'
            ) : (
              'Create Legal Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
