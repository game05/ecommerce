'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bath, Heart, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Loading from '@/components/loading';

// Type pour les produits
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
};

export default function ServiettesPage() {
  const [serviettes, setServiettes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'Serviettes')
          .order('id');

        if (error) throw error;
        setServiettes(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!serviettes || serviettes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Aucun produit disponible pour le moment
          </h2>
          <p className="mt-2 text-gray-600">
            Veuillez réessayer ultérieurement ou contactez-nous pour plus d'informations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
      {/* Header */}
      <div className="mb-12">
        {/* En-tête avec icônes */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Bath className="h-8 w-8 text-pink-500" />
          <Sparkles className="h-6 w-6 text-pink-400" />
          <Heart className="h-7 w-7 text-pink-500" />
        </div>

        {/* Titre et description */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Des Serviettes{' '}
            <span className="text-pink-500">Douces et Confortables</span>
            <br />pour Votre Bébé
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            Découvrez notre collection de serviettes délicates, spécialement conçues 
            pour envelopper votre petit trésor dans un cocon de douceur après le bain.
          </p>
        </div>

        {/* Badges caractéristiques */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="bg-pink-50 px-4 py-2 rounded-full text-sm font-medium text-pink-600">
            100% Coton Bio
          </span>
          <span className="bg-pink-50 px-4 py-2 rounded-full text-sm font-medium text-pink-600">
            Ultra Absorbantes
          </span>
          <span className="bg-pink-50 px-4 py-2 rounded-full text-sm font-medium text-pink-600">
            Douces pour la Peau
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviettes.map((serviette) => {
          // Création du slug à partir du nom du produit
          const slug = encodeURIComponent(serviette.name.toLowerCase().replace(/ /g, '-'));

          return (
            <Link 
              key={serviette.id}
              href={`/produit/${slug}`}
              prefetch={true}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={serviette.image_url}
                  alt={serviette.name}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="eager"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-500 transition-colors">
                  {serviette.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {serviette.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-pink-500 font-semibold">
                    {serviette.price.toFixed(2)}€
                  </span>
                  <span className="inline-flex items-center bg-pink-500 text-white px-4 py-2 rounded-full group-hover:bg-pink-600 transition-colors">
                    Voir le produit
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Qualité Premium</h3>
          <p className="text-gray-600">Matériaux doux et absorbants pour le confort de bébé</p>
        </div>
        <div className="text-center">
          <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Lavage Facile</h3>
          <p className="text-gray-600">Résistantes aux lavages fréquents</p>
        </div>
        <div className="text-center">
          <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Hypoallergénique</h3>
          <p className="text-gray-600">Sans produits chimiques nocifs</p>
        </div>
      </div>
    </div>
  );
}
