'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

function RoleBadge({ role }) {
  const styles = {
    user: 'bg-blue-100 text-blue-700',
    lawyer: 'bg-green-100 text-green-700',
    admin: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[role] || 'bg-gray-100 text-gray-600'}`}>
      {role}
    </span>
  );
}

function RoleDropdown({ user, onRoleChange }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = async (newRole) => {
    if (newRole === user.role) { setOpen(false); return; }
    setOpen(false);
    setLoading(true);
    try {
      await axiosInstance.patch(`/api/admin/users/${user._id}/role`, { role: newRole });
      onRoleChange(user._id, newRole);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <svg className="animate-spin h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <>Change Role <span className="text-gray-400">▾</span></>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
          {['user', 'lawyer', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => handleSelect(role)}
              className={`w-full text-left px-3 py-2 text-xs font-medium capitalize hover:bg-gray-50 transition-colors ${user.role === role ? 'text-gray-400 cursor-default' : 'text-gray-700'}`}
            >
              {user.role === role ? `✓ ${role}` : role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteButton({ userId, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setLoading(true);
    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`);
      onDelete(userId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Deleting…' : 'Delete'}
    </button>
  );
}

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin guard
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.role !== 'admin') router.replace('/');
    } catch { router.replace('/'); }
  }, [router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/admin/users');
      setUsers(res.data);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = (id, newRole) => {
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Manage Users</h1>
          {!loading && <p className="text-sm text-gray-500 mt-0.5">{users.length} total users</p>}
        </div>
        <button onClick={fetchUsers} className="text-sm text-[#1A3C5E] hover:underline">↻ Refresh</button>
      </div>

      {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-4 text-sm">{error}</div>}

      {loading ? (
        <div className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
              <div className="h-7 w-24 bg-gray-200 rounded-lg" />
              <div className="h-7 w-16 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <span className="text-5xl">👥</span>
          <p className="mt-4 text-gray-500 font-medium">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                {['User', 'Email', 'Role', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => {
                const avatar = u.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1A3C5E&color=fff&size=64`;
                return (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">{u.email}</td>
                    <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <RoleDropdown user={u} onRoleChange={handleRoleChange} />
                        <DeleteButton userId={u._id} onDelete={handleDelete} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
