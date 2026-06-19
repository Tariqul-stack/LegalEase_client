'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaUser, 
  FaHistory, 
  FaComments, 
  FaUserEdit, 
  FaClipboardList, 
  FaBriefcase, 
  FaUsers, 
  FaMoneyBillWave, 
  FaChartBar 
} from 'react-icons/fa';

const navByRole = {
  user: [
    { label: 'My Profile', path: '/dashboard', icon: <FaUser /> },
    { label: 'Hiring History', path: '/dashboard/user/hiring-history', icon: <FaHistory /> },
    { label: 'My Comments', path: '/dashboard/user/comments', icon: <FaComments /> },
    { label: 'Update Profile', path: '/dashboard/user/update-profile', icon: <FaUserEdit /> },
  ],
  lawyer: [
    { label: 'My Profile', path: '/dashboard', icon: <FaUser /> },
    { label: 'Hiring Requests', path: '/dashboard/lawyer/hiring-history', icon: <FaClipboardList /> },
    { label: 'Manage Profile', path: '/dashboard/lawyer/manage-legal-profile', icon: <FaBriefcase /> },
  ],
  admin: [
    { label: 'My Profile', path: '/dashboard', icon: <FaUser /> },
    { label: 'Manage Users', path: '/dashboard/admin/manage-users', icon: <FaUsers /> },
    { label: 'All Transactions', path: '/dashboard/admin/all-transactions', icon: <FaMoneyBillWave /> },
    { label: 'Analytics', path: '/dashboard/admin/analytics', icon: <FaChartBar /> },
  ],
};

const adminAccessibleLinks = navByRole.admin;

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (!token || !storedUser) {
        router.replace('/login');
        return;
      }
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        router.replace('/login');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A3C5E]" />
      </div>
    );
  }

  const links = user.role === 'admin' ? adminAccessibleLinks : navByRole[user.role] || navByRole.user;
  const roleBadge = {
    user: 'bg-blue-100 text-blue-700',
    lawyer: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700',
  }[user.role] || 'bg-gray-100 text-gray-700';

  const avatarSrc =
    user.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1A3C5E&color=fff&size=128`;

  return (
    <div className="flex min-h-[calc(100vh-128px)] bg-gray-100">
      {/* ── Mobile Overlay ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#1A3C5E] text-white flex flex-col transform transition-transform duration-200 md:static md:translate-x-0 md:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Info */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={avatarSrc}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white/30 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 capitalize ${roleBadge}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-blue-200 hover:text-white transition-colors px-3"
          >
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#1A3C5E] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-lg">Dashboard</span>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
