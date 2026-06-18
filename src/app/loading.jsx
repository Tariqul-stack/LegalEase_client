export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm z-50">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#1A3C5E] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-[#1A3C5E] font-semibold tracking-wider animate-pulse">
        Loading...
      </p>
    </div>
  );
}
