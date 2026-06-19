'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaHome, FaLock, FaTachometerAlt, FaUserShield } from 'react-icons/fa';

export default function UnauthorizedPage() {
  const [role, setRole] = useState('guest');

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setRole(user?.role || 'unknown');
        }
      } catch {
        setRole('unknown');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-[calc(100vh-128px)] bg-[#0f2740] text-white flex items-center justify-center px-4 py-16">
      <section className="w-full max-w-lg bg-white/10 border border-white/15 shadow-2xl rounded-2xl p-8 text-center backdrop-blur">
        <div className="mx-auto w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-5">
          <FaLock className="text-3xl text-blue-100" />
        </div>

        <h1 className="text-3xl font-extrabold mb-3">Access Denied</h1>
        <p className="text-blue-100 leading-relaxed">
          You do not have permission to view this dashboard page.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
          <FaUserShield className="text-blue-200" />
          Current role:
          <span className="capitalize text-white">{role}</span>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#1A3C5E] px-5 py-3 text-sm font-bold hover:bg-blue-50 transition-colors"
          >
            <FaTachometerAlt />
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
          >
            <FaHome />
            Go Home
          </Link>
        </div>
      </section>
    </main>
  );
}
