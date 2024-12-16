'use client';

import Link from 'next/link';

export default function AnnulationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Paiement annulé
            </h1>
            <p className="text-gray-600 mb-8">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/commande" 
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors"
              >
                Réessayer le paiement
              </Link>
              <Link 
                href="/" 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
