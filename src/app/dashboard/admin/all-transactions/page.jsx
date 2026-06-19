'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import axiosInstance from '@/lib/axios';

function AllTransactionsContent() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/api/admin/transactions');
        setTransactions(res.data);
      } catch {
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const total = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">All Transactions</h1>
          {!loading && transactions.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} ·{' '}
              <span className="font-semibold text-green-700">Total: ${total.toLocaleString()}</span>
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-4 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 px-6 py-4 border-b border-gray-100">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <span className="text-5xl">💳</span>
          <p className="mt-4 text-lg font-semibold text-gray-700">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
            Transactions will appear here after payments are made by clients.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                {['Transaction ID', 'User Email', 'Lawyer Email', 'Amount', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono text-gray-500 whitespace-nowrap">
                    {t._id}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {t.userEmail || '—'}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {t.lawyerEmail || '—'}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-green-700 whitespace-nowrap">
                    ${(t.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })
                      : '—'}
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

export default function AllTransactionsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AllTransactionsContent />
    </ProtectedRoute>
  );
}
