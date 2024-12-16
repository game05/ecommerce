'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur accède directement à cette page sans passer par le processus de commande
    // on le redirige vers la page d'accueil
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Merci pour votre{' '}
          <span className="text-pink-500">commande</span> !
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Nous avons bien reçu votre commande. Vous recevrez bientôt un email de confirmation avec tous les détails.
        </p>
        <div className="space-y-4">
          <p className="text-gray-600">
            Vous serez redirigé vers la page d'accueil dans quelques secondes...
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
