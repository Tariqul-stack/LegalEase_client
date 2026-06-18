'use client';

import { useEffect, useState } from 'react';
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

export default function UserHiringHistoryPage() {
  const [hirings, setHirings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/api/hirings/user');
        setHirings(res.data);
      } catch {
        setError('Failed to load hiring history.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Hiring History</h1>
        <div className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 px-6 py-4 border-b border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/6" />
              <div className="h-4 bg-gray-200 rounded w-1/6" />
              <div className="h-4 bg-gray-200 rounded w-1/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Hiring History</h1>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {!error && hirings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <span className="text-5xl">📋</span>
          <p className="mt-4 text-gray-500 font-medium">You haven't hired any lawyers yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                {['Lawyer Name', 'Specialization', 'Fee', 'Date', 'Status', 'Payment'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
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
                    {h.lawyerName}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {h.specialization || '—'}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {h.fee != null ? `$${h.fee}/hr` : '—'}
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
                    {h.status === 'accepted' ? (
                      h.isPaid ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          ✓ Paid
                        </span>
                      ) : (
                        <button
                          disabled
                          title="Stripe payment coming soon"
                          className="px-3 py-1.5 bg-[#1A3C5E] text-white text-xs font-medium rounded-lg opacity-60 cursor-not-allowed"
                        >
                          Pay Now
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
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
