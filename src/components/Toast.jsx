'use client';

import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Allow exit animation to finish
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-green-600',
    error: 'bg-red-600',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };

  return (
    <div className="fixed top-24 right-4 z-[100] pointer-events-none sm:p-6 p-4">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white font-medium transform transition-all duration-300 ${
          visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${bgStyles[type] || bgStyles.success}`}
      >
        {icons[type]}
        <p className="text-sm">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 opacity-70 hover:opacity-100 transition-opacity pointer-events-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
