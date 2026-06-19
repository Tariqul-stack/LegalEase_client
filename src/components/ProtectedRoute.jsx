'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function LoadingSpinner() {
  return (
    <div className="min-h-[240px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A3C5E]" />
    </div>
  );
}

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        router.replace('/login');
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        const hasAccess =
          user?.role === 'admin' ||
          allowedRoles.length === 0 ||
          allowedRoles.includes(user?.role);

        if (!hasAccess) {
          router.replace('/unauthorized');
          return;
        }

        setIsAllowed(true);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/login');
      } finally {
        setChecking(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [allowedRoles, router]);

  if (checking || !isAllowed) {
    return <LoadingSpinner />;
  }

  return children;
}
