'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        <p className="text-pink-500 text-lg font-medium">Chargement en cours...</p>
      </div>
    </div>
  );
}
