'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardHomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
      } catch { }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3C5E]" />
      </div>
    );
  }

  const roleBadgeStyles = {
    user: 'bg-blue-100 text-blue-700',
    lawyer: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700',
  };

  const avatarSrc =
    user.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1A3C5E&color=fff&size=256`;

  return (
    <div>
      <div className="bg-white rounded-2xl shadow p-8 max-w-md mx-auto">
        <Link href="/" className="inline-block text-sm text-gray-500 hover:text-[#1A3C5E] mb-4">
          ← Back to Home
        </Link>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">My Profile</h1>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={avatarSrc}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#1A3C5E]/20 shadow flex-shrink-0"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            <span
              className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full capitalize ${roleBadgeStyles[user.role] || 'bg-gray-100 text-gray-700'
                }`}
            >
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
          {user.role === 'user' && (
            <Link
              href="/dashboard/user/update-profile"
              className="px-5 py-2.5 bg-[#1A3C5E] text-white text-sm font-medium rounded-lg hover:bg-[#15304a] transition-colors"
            >
              Update Profile
            </Link>
          )}
          <Link
            href="/browse"
            className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Browse Lawyers
          </Link>
        </div>
      </div>
    </div>
  );
}
