'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

const ITEMS_PER_PAGE = 8;

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow p-6 animate-pulse">
      <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
      <div className="h-9 bg-gray-200 rounded-md w-full" />
    </div>
  );
}

// ─── Lawyer Card ──────────────────────────────────────────────────────────────
function LawyerCard({ lawyer }) {
  const avatarSrc =
    lawyer.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=1A3C5E&color=fff&size=128`;

  const isBusy = lawyer.status === 'busy';

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center relative">
      {isBusy && (
        <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
          Busy
        </span>
      )}
      <img
        src={avatarSrc}
        alt={lawyer.name}
        className="w-20 h-20 rounded-full object-cover border-4 border-[#1A3C5E]/20 mb-4"
      />
      <h3 className="text-base font-bold text-gray-800 mb-1 truncate w-full">
        {lawyer.name}
      </h3>
      <p className="text-sm text-blue-600 font-medium mb-1 truncate w-full">
        {lawyer.specialization || 'General Practice'}
      </p>
      {lawyer.consultationFee != null && (
        <p className="text-xs text-gray-500 mb-4">
          <span className="font-semibold text-gray-700">${lawyer.consultationFee}/hr</span>
        </p>
      )}
      <Link
        href={`/lawyers/${lawyer._id}`}
        className="mt-auto w-full py-2 px-4 rounded-md bg-[#1A3C5E] text-white text-sm font-medium hover:bg-[#15304a] transition-colors"
      >
        View Profile
      </Link>
    </div>
  );
}

// ─── Browse Page ──────────────────────────────────────────────────────────────
export default function BrowsePage() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [feeRange, setFeeRange] = useState('any');
  const [availability, setAvailability] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await axiosInstance.get('/api/lawyers');
        setLawyers(res.data);
      } catch {
        setError('Could not load lawyers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, feeRange, availability]);

  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      // Search filter
      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        lawyer.name?.toLowerCase().includes(term) ||
        lawyer.specialization?.toLowerCase().includes(term);

      // Fee filter
      const fee = lawyer.consultationFee ?? 0;
      let matchesFee = true;
      if (feeRange === 'under100') matchesFee = fee < 100;
      else if (feeRange === '100to300') matchesFee = fee >= 100 && fee <= 300;
      else if (feeRange === 'above300') matchesFee = fee > 300;

      // Availability filter
      let matchesAvailability = true;
      if (availability === 'available') matchesAvailability = lawyer.status !== 'busy';
      else if (availability === 'busy') matchesAvailability = lawyer.status === 'busy';

      return matchesSearch && matchesFee && matchesAvailability;
    });
  }, [lawyers, search, feeRange, availability]);

  const totalPages = Math.max(1, Math.ceil(filteredLawyers.length / ITEMS_PER_PAGE));
  const paginatedLawyers = filteredLawyers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const resetFilters = () => {
    setSearch('');
    setFeeRange('any');
    setAvailability('all');
  };

  const hasActiveFilters = search || feeRange !== 'any' || availability !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="bg-[#1A3C5E] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Browse Lawyers</h1>
          <p className="text-blue-200 text-base">
            {loading
              ? 'Loading available lawyers…'
              : `${filteredLawyers.length} lawyer${filteredLawyers.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Search & Filters ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or specialization…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E] text-gray-700"
              />
            </div>

            {/* Fee Range Filter */}
            <select
              value={feeRange}
              onChange={(e) => setFeeRange(e.target.value)}
              className="sm:w-48 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E] text-gray-700 bg-white"
            >
              <option value="any">Any Fee</option>
              <option value="under100">Under $100/hr</option>
              <option value="100to300">$100 – $300/hr</option>
              <option value="above300">Above $300/hr</option>
            </select>

            {/* Availability Filter */}
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="sm:w-44 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C5E]/40 focus:border-[#1A3C5E] text-gray-700 bg-white"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="sm:w-auto px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ── Error State ────────────────────────────────────────────────── */}
        {error && (
          <div className="text-center py-20">
            <span className="text-5xl">⚠️</span>
            <p className="mt-4 text-gray-600 font-medium">{error}</p>
          </div>
        )}

        {/* ── Loading Skeletons ──────────────────────────────────────────── */}
        {!error && loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── No Results ────────────────────────────────────────────────── */}
        {!error && !loading && paginatedLawyers.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl">🔍</span>
            <p className="mt-4 text-lg font-semibold text-gray-700">
              No lawyers found matching your search
            </p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Try adjusting your filters or search term
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-block px-6 py-2.5 bg-[#1A3C5E] text-white rounded-lg text-sm font-medium hover:bg-[#15304a] transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* ── Lawyer Grid ───────────────────────────────────────────────── */}
        {!error && !loading && paginatedLawyers.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {paginatedLawyers.map((lawyer) => (
                <LawyerCard key={lawyer._id} lawyer={lawyer} />
              ))}
            </div>

            {/* ── Pagination ─────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <span className="text-sm font-medium text-gray-600">
                  Page <span className="font-bold text-[#1A3C5E]">{currentPage}</span> of{' '}
                  <span className="font-bold text-[#1A3C5E]">{totalPages}</span>
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
