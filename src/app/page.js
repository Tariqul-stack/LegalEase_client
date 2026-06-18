'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axiosInstance from '@/lib/axios';

// ─── Animation Variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow p-6 animate-pulse">
      <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
      <div className="h-8 bg-gray-200 rounded-md w-full" />
    </div>
  );
}

// ─── Lawyer Card ──────────────────────────────────────────────────────────────

function LawyerCard({ lawyer }) {
  const avatarSrc =
    lawyer.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=1A3C5E&color=fff&size=128`;

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center"
    >
      <img
        src={avatarSrc}
        alt={lawyer.name}
        className="w-20 h-20 rounded-full object-cover border-4 border-[#1A3C5E]/20 mb-4"
      />
      <h3 className="text-lg font-bold text-gray-800 mb-1">{lawyer.name}</h3>
      <p className="text-sm text-blue-600 font-medium mb-1">
        {lawyer.specialization || 'General Practice'}
      </p>
      {lawyer.consultationFee && (
        <p className="text-xs text-gray-500 mb-4">
          Fee: <span className="font-semibold text-gray-700">${lawyer.consultationFee}/hr</span>
        </p>
      )}
      <Link
        href={`/lawyers/${lawyer._id}`}
        className="mt-auto w-full py-2 px-4 rounded-md bg-[#1A3C5E] text-white text-sm font-medium hover:bg-[#15304a] transition-colors"
      >
        View Profile
      </Link>
    </motion.div>
  );
}

// ─── Legal Categories ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { icon: '⚖️', name: 'Criminal Law' },
  { icon: '🏢', name: 'Corporate Law' },
  { icon: '👨‍👩‍👧', name: 'Family Law' },
  { icon: '🌍', name: 'Immigration Law' },
  { icon: '🏠', name: 'Property Law' },
  { icon: '📜', name: 'Civil Law' },
];

// ─── Top Expert Card ──────────────────────────────────────────────────────────

function TopExpertCard({ lawyer, rank }) {
  const avatarSrc =
    lawyer.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=1A3C5E&color=fff&size=128`;

  const rankColors = ['bg-yellow-400', 'bg-gray-400', 'bg-amber-700'];

  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center gap-5">
      <div className="relative flex-shrink-0">
        <img
          src={avatarSrc}
          alt={lawyer.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-[#1A3C5E]/20"
        />
        <span
          className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${rankColors[rank]} text-white text-xs font-bold flex items-center justify-center shadow`}
        >
          {rank + 1}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-800 truncate">{lawyer.name}</h4>
        <p className="text-sm text-blue-600 truncate">
          {lawyer.specialization || 'General Practice'}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="inline-block bg-[#1A3C5E]/10 text-[#1A3C5E] text-xs font-semibold px-2 py-1 rounded-full">
          {lawyer.totalHires ?? 0} hires
        </span>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const featuredLawyers = lawyers.slice(0, 6);
  const topExperts = [...lawyers]
    .sort((a, b) => (b.totalHires ?? 0) - (a.totalHires ?? 0))
    .slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ── 1. Hero Section ──────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#1A3C5E] via-[#1e4a75] to-[#0f2540] text-white overflow-hidden">
        {/* Decorative blurred circles */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 bg-blue-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.span
              custom={0}
              variants={fadeUp}
              className="inline-block mb-4 bg-white/10 text-blue-200 text-xs font-semibold tracking-widest uppercase px-4 py-1 rounded-full border border-white/20"
            >
              Trusted by thousands
            </motion.span>
            <motion.h1
              custom={0.1}
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            >
              Find &amp; Hire Expert
              <br />
              <span className="text-blue-300">Legal Counsel</span>
            </motion.h1>
            <motion.p
              custom={0.2}
              variants={fadeUp}
              className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10"
            >
              Connect with verified legal experts for all your legal needs —
              fast, secure, and reliable.
            </motion.p>
            <motion.div custom={0.3} variants={fadeUp}>
              <Link
                href="/browse"
                className="inline-block bg-white text-[#1A3C5E] font-bold px-8 py-4 rounded-lg text-base shadow-lg hover:bg-blue-50 transition-colors"
              >
                Browse Lawyers →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Featured Lawyers ───────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Lawyers</h2>
            <p className="mt-3 text-gray-500 text-base">
              Hand-picked verified professionals ready to help you
            </p>
          </div>

          {error ? (
            <div className="text-center py-16 text-gray-500">
              <span className="text-4xl">⚠️</span>
              <p className="mt-3">{error}</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredLawyers.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <span className="text-5xl">👨‍⚖️</span>
              <p className="mt-4 text-lg font-medium text-gray-600">No lawyers found yet.</p>
              <p className="text-sm text-gray-400">Check back soon — experts are joining daily!</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {featuredLawyers.map((lawyer) => (
                <LawyerCard key={lawyer._id} lawyer={lawyer} />
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/browse"
              className="inline-block border-2 border-[#1A3C5E] text-[#1A3C5E] font-semibold px-8 py-3 rounded-lg hover:bg-[#1A3C5E] hover:text-white transition-colors"
            >
              View All Lawyers
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. Legal Categories ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Legal Categories</h2>
            <p className="mt-3 text-gray-500 text-base">
              Find a specialist for your specific legal situation
            </p>
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.name} variants={fadeUp}>
                <Link
                  href="/browse"
                  className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-[#1A3C5E] hover:shadow-md bg-gray-50 hover:bg-blue-50 transition-all group h-full"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1A3C5E] text-center">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. Top Legal Experts ──────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#1A3C5E] to-[#0f2540] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold">Top Legal Experts</h2>
            <p className="mt-3 text-blue-200 text-base">
              Our most sought-after professionals based on client hires
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-6 animate-pulse flex gap-5">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-white/20 rounded w-1/2" />
                    <div className="h-3 bg-white/20 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : topExperts.length === 0 ? (
            <div className="text-center py-12 text-blue-200">
              <span className="text-4xl">🏆</span>
              <p className="mt-3">No data yet. Be the first to hire!</p>
            </div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {topExperts.map((lawyer, i) => (
                <motion.div key={lawyer._id} variants={fadeUp}>
                  <TopExpertCard lawyer={lawyer} rank={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
