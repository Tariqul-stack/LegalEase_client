'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import axiosInstance from '@/lib/axios';

const STAT_CONFIG = [
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: '👥',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    valueColor: 'text-blue-700',
    barColor: 'bg-blue-500',
  },
  {
    key: 'totalLawyers',
    label: 'Total Lawyers',
    icon: '⚖️',
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100',
    valueColor: 'text-green-700',
    barColor: 'bg-green-500',
  },
  {
    key: 'totalHires',
    label: 'Total Hires',
    icon: '📋',
    color: 'bg-yellow-50 border-yellow-200',
    iconBg: 'bg-yellow-100',
    valueColor: 'text-yellow-700',
    barColor: 'bg-yellow-500',
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: '💰',
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
    valueColor: 'text-purple-700',
    barColor: 'bg-purple-500',
    format: (v) => `$${(v || 0).toLocaleString()}`,
  },
];

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function AnalyticsContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/api/admin/analytics');
        setStats(res.data);
      } catch {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Compute bar chart max for proportional rendering
  // We compare users, lawyers, hires but keep revenue separate (different scale)
  const nonRevenueMax = stats
    ? Math.max(stats.totalUsers || 0, stats.totalLawyers || 0, stats.totalHires || 0, 1)
    : 1;

  const getBarWidth = (key, value) => {
    if (key === 'totalRevenue') return '100%'; // always full for revenue
    return `${Math.round(((value || 0) / nonRevenueMax) * 100)}%`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform overview at a glance</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm">{error}</div>
      )}

      {/* ── Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {loading
          ? [1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)
          : STAT_CONFIG.map((cfg) => {
              const raw = stats?.[cfg.key] ?? 0;
              const display = cfg.format ? cfg.format(raw) : raw.toLocaleString();
              return (
                <div
                  key={cfg.key}
                  className={`bg-white rounded-2xl shadow border p-6 flex flex-col gap-2 ${cfg.color}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {cfg.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{cfg.label}</p>
                      <p className={`text-2xl font-extrabold mt-0.5 ${cfg.valueColor}`}>{display}</p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* ── CSS Bar Chart ─────────────────────────────────────────────── */}
      {!loading && stats && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-700 mb-5">Platform Metrics — Visual Overview</h2>
          <div className="space-y-5">
            {STAT_CONFIG.map((cfg) => {
              const raw = stats?.[cfg.key] ?? 0;
              const display = cfg.format ? cfg.format(raw) : raw.toLocaleString();
              const barPct = getBarWidth(cfg.key, raw);
              return (
                <div key={cfg.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${cfg.valueColor}`}>{display}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${cfg.barColor} h-3 rounded-full transition-all duration-700`}
                      style={{ width: barPct }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-5">
            * Bar widths for Users, Lawyers, and Hires are proportional to each other. Revenue bar is always shown at full width for visibility.
          </p>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}
