'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 bg-gray-50 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
        Something went wrong!
      </h2>
      
      <p className="text-gray-500 mb-8 max-w-md mx-auto bg-white p-4 rounded-lg shadow-sm border border-gray-100 font-mono text-sm break-words">
        {error.message || 'An unexpected error occurred.'}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-[#1A3C5E] hover:bg-[#15304a] transition-all shadow-md hover:shadow-lg"
        >
          Try Again
        </button>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
