'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

// Role Selection Modal Component
function RoleSelectionModal({ onSelectRole }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-[#1A3C5E] px-8 py-6 text-center">
          <h2 className="text-2xl font-bold text-white">One Last Step!</h2>
          <p className="text-blue-200 text-sm mt-2">Tell us how you plan to use LegalEase</p>
        </div>
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onSelectRole('user')}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-[#1A3C5E] hover:bg-blue-50 transition-all group"
            >
              <span className="text-4xl mb-3">👤</span>
              <span className="text-base font-semibold text-gray-800 group-hover:text-[#1A3C5E]">
                I am a Client
              </span>
              <span className="text-xs text-gray-500 mt-1 text-center">
                I want to hire a lawyer
              </span>
            </button>
            <button
              onClick={() => onSelectRole('lawyer')}
              className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-[#1A3C5E] hover:bg-blue-50 transition-all group"
            >
              <span className="text-4xl mb-3">⚖️</span>
              <span className="text-base font-semibold text-gray-800 group-hover:text-[#1A3C5E]">
                I am a Lawyer
              </span>
              <span className="text-xs text-gray-500 mt-1 text-center">
                I want to offer legal services
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [registeredData, setRegisteredData] = useState(null); // { token, user }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      if (formData.photo) {
        payload.photo = formData.photo;
      }

      const response = await axiosInstance.post('/api/auth/register', payload);
      const { token, user } = response.data;

      // Save temp data and show role modal
      setRegisteredData({ token, user });
      setShowRoleModal(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message ||
        'Registration failed. This email may already be in use.';
      setError(errorMsg);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    if (!registeredData) return;

    const { token, user } = registeredData;

    // Override the role in the user object for localStorage
    // (Proper role update via admin API will be handled in a later step)
    const updatedUser = { ...user, role: selectedRole };

    login(token, updatedUser);
    toast.success('Account created successfully!');
    setShowRoleModal(false);
    router.push('/');
  };

  return (
    <>
      {showRoleModal && <RoleSelectionModal onSelectRole={handleRoleSelect} />}

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-8 py-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#1A3C5E]">Create Account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Join LegalEase and connect with top legal professionals
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1A3C5E] focus:border-[#1A3C5E] sm:text-sm text-gray-900"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1A3C5E] focus:border-[#1A3C5E] sm:text-sm text-gray-900"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1A3C5E] focus:border-[#1A3C5E] sm:text-sm text-gray-900"
                  placeholder="Min. 6 characters"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1A3C5E] focus:border-[#1A3C5E] sm:text-sm text-gray-900"
                  placeholder="Re-enter your password"
                />
              </div>

              {/* Profile Photo URL (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="photo">
                  Profile Photo URL{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="photo"
                  name="photo"
                  type="url"
                  value={formData.photo}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1A3C5E] focus:border-[#1A3C5E] sm:text-sm text-gray-900"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-100">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A3C5E] hover:bg-[#15304a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A3C5E] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const decoded = jwtDecode(credentialResponse.credential);

                      const response = await axiosInstance.post('/api/auth/google-login', {
                        name: decoded.name,
                        email: decoded.email,
                        photo: decoded.picture,
                      });

                      const { token, user } = response.data;
                      setRegisteredData({ token, user });
                      setShowRoleModal(true);
                    } catch (error) {
                      toast.error('Google login failed. Please try again.');
                    }
                  }}
                  onError={() => toast.error('Google login failed.')}
                  width="100%"
                />
              </div>
            </div>
          </div>

          {/* Footer link */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-[#1A3C5E] hover:text-blue-800 transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
