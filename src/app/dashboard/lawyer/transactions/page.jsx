'use client';

import { useCallback, useEffect, useState } from 'react';
import { FaMoneyBillWave, FaReceipt } from 'react-icons/fa';
import ProtectedRoute from '@/components/ProtectedRoute';
import axiosInstance from '@/lib/axios';

function PaidBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
      Paid
    </span>
  );
}

function formatDate(date) {
  if (!date) return '—';

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function LawyerTransactionsContent() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await axiosInstance.get('/api/hirings/lawyer');
      const paidTransactions = res.data.filter((hiring) => hiring.isPaid === true);

      setTransactions(paidTransactions);
    } catch {
      setError('Failed to load earnings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchTransactions]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">My Earnings</h1>
          {!loading && transactions.length > 0 && (
            <p className="mt-0.5 text-sm text-gray-500">
              {transactions.length} paid transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={fetchTransactions}
          className="flex items-center gap-2 text-sm font-medium text-[#1A3C5E] hover:underline"
        >
          <FaReceipt size={14} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="overflow-hidden rounded-2xl bg-white shadow animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 border-b border-gray-100 px-6 py-4">
              <div className="h-4 w-1/4 rounded bg-gray-200" />
              <div className="h-4 w-1/4 rounded bg-gray-200" />
              <div className="h-4 w-1/6 rounded bg-gray-200" />
              <div className="h-4 w-1/6 rounded bg-gray-200" />
              <div className="h-4 w-1/6 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl bg-white py-20 text-center shadow">
          <FaMoneyBillWave className="mx-auto text-5xl text-gray-300" />
          <p className="mt-4 font-medium text-gray-500">No transactions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                {['Client Name', 'Client Email', 'Amount', 'Date', 'Status'].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-800">
                    {transaction.clientName || '—'}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {transaction.clientEmail || '—'}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-green-700">
                    ${(transaction.fee || 0).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <PaidBadge />
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

export default function LawyerTransactionsPage() {
  return (
    <ProtectedRoute allowedRoles={['lawyer']}>
      <LawyerTransactionsContent />
    </ProtectedRoute>
  );
}
