import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 bg-gray-50 text-center">
      {/* Pure CSS Illustration */}
      <div className="relative w-48 h-48 mb-8 mx-auto animate-bounce-slow">
        <div className="absolute inset-0 bg-[#1A3C5E] rounded-full opacity-10 animate-ping"></div>
        <div className="absolute inset-4 bg-[#1A3C5E] rounded-full opacity-20"></div>
        <div className="absolute inset-8 bg-[#1A3C5E] rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-5xl font-black">?</span>
        </div>
        {/* Floating elements */}
        <div className="absolute top-0 right-4 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-0 w-6 h-6 bg-red-400 rounded-full animate-bounce"></div>
      </div>

      <h1 className="text-7xl font-extrabold text-[#1A3C5E] tracking-tight mb-2">404</h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
        Oops! Page not found
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        The page you are looking for doesn't exist or has been moved. Let's get you back to finding top legal professionals.
      </p>
      
      <Link 
        href="/"
        className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg text-white bg-[#1A3C5E] hover:bg-[#15304a] transition-all shadow-md hover:shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
}
