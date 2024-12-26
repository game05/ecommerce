'use client';

interface FreeShippingBannerProps {
  remainingAmount: number;
}

export default function FreeShippingBanner({ remainingAmount }: FreeShippingBannerProps) {
  if (remainingAmount <= 0) return null;

  const progressPercentage = ((25 - remainingAmount) / 25) * 100;

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 011 1v6h-1.05a2.5 2.5 0 00-4.9 0H10v-4a1 1 0 011-1h3V7z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-rose-800">
            Plus que <span className="font-bold">{remainingAmount.toFixed(2)}€</span> d&apos;achat pour bénéficier de la livraison gratuite !
          </p>
          <div className="mt-2 w-full bg-rose-200 rounded-full h-2.5">
            <div 
              className="bg-rose-500 rounded-full h-2.5 transition-all duration-500"
              style={{ width: `${Math.min(100, progressPercentage)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
