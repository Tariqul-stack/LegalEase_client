'use client';

import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
        styles[status] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {status}
    </span>
  );
}

function ActionButtons({ hiring, onStatusChange }) {
  const [loading, setLoading] = useState(null); // 'accepted' | 'rejected' | null

  if (hiring.status === 'accepted' || hiring.status === 'rejected') {
    return <span className="text-xs text-gray-400 italic">No actions</span>;
  }

  const handleAction = async (status) => {
    setLoading(status);
    try {
      await axiosInstance.patch(`/api/hirings/${hiring._id}/status`, { status });
      onStatusChange(hiring._id, status);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${status} request.`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction('accepted')}
        disabled={!!loading}
        className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        {loading === 'accepted' ? (
          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : '✓'}
        Accept
      </button>
      <button
        onClick={() => handleAction('rejected')}
        disabled={!!loading}
        className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        {loading === 'rejected' ? (
          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : '✕'}
        Reject
      </button>
    </div>
  );
}

export default function LawyerHiringHistoryPage() {
  const [hirings, setHirings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHirings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/hirings/lawyer');
      setHirings(res.data);
    } catch {
      setError('Failed to load hiring requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHirings();
  }, [fetchHirings]);

  // Optimistic update — no full refetch needed
  const handleStatusChange = (id, newStatus) => {
    setHirings((prev) =>
      prev.map((h) => (h._id === id ? { ...h, status: newStatus } : h))
    );
  };

  const counts = hirings.reduce(
    (acc, h) => {
      acc[h.status] = (acc[h.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-gray-800">Hiring Requests</h1>
        <button
          onClick={fetchHirings}
          className="text-sm text-[#1A3C5E] hover:underline flex items-center gap-1"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Summary Pills */}
      {!loading && hirings.length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            {counts.pending || 0} Pending
          </span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            {counts.accepted || 0} Accepted
          </span>
          <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
            {counts.rejected || 0} Rejected
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 px-6 py-4 border-b border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/6" />
              <div className="h-4 bg-gray-200 rounded w-1/6" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : hirings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <span className="text-5xl">📭</span>
          <p className="mt-4 text-gray-500 font-medium">No hiring requests yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            When clients hire you, their requests will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                {['Client Name', 'Client Email', 'Request Date', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {hirings.map((h) => (
                <tr key={h._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {h.clientName || '—'}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {h.clientEmail || '—'}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {h.createdAt
                      ? new Date(h.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={h.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <ActionButtons hiring={h} onStatusChange={handleStatusChange} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
