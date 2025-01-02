'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bath, Heart, Sparkles, Ruler, Star } from 'lucide-react';
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
  size?: 'small' | 'medium' | 'large'; // 50x100, 70x140, 100x150
  average_rating?: number;
  total_reviews?: number;
};

// Types de tailles disponibles
const SIZES = [
  {
    id: 'small',
    name: 'Serviette de toilette',
    dimensions: '50x100 cm',
    icon: '🧸',
    description: 'Idéale pour la toilette quotidienne',
    color: 'bg-pink-100'
  },
  {
    id: 'medium',
    name: 'Drap de douche',
    dimensions: '70x140 cm',
    icon: '🚿',
    description: 'Parfaite pour la douche',
    color: 'bg-purple-100'
  },
  {
    id: 'large',
    name: 'Drap de bain',
    dimensions: '100x150 cm',
    icon: '🛁',
    description: 'Idéal pour le bain',
    color: 'bg-blue-100'
  }
];

export default function ServiettesPage() {
  const [serviettes, setServiettes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    async function getProducts() {
      try {
        // Récupérer les produits
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, description, price, image_url, stock, size')
          .eq('category', 'Serviettes')
          .order('id');

        if (productsError) throw productsError;

        // Récupérer les notes moyennes pour chaque produit
        const productsWithRatings = await Promise.all((productsData || []).map(async (product) => {
          const { data: reviewsData } = await supabase
            .from('avis')
            .select('rating')
            .eq('product_id', product.id);

          let average_rating = 0;
          let total_reviews = 0;

          if (reviewsData && reviewsData.length > 0) {
            total_reviews = reviewsData.length;
            const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
            average_rating = Math.round((sum / total_reviews) * 10) / 10;
          }

          return {
            ...product,
            average_rating,
            total_reviews
          };
        }));

        setServiettes(productsWithRatings);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  // Filtrer les serviettes selon la taille sélectionnée
  const filteredServiettes = selectedSize
    ? serviettes.filter(s => s.size === selectedSize)
    : serviettes;

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
      {/* Filtres de taille */}
      <div className="mb-8 md:mb-12">
        {/* Titre */}
        <h2 className="text-2xl md:text-2xl font-bold text-center mb-6">
          Choisissez votre taille
        </h2>

        {/* Grille de sélection */}
        <div className="grid grid-cols-1 gap-3 max-w-sm md:max-w-4xl mx-auto px-4 md:px-0 md:grid-cols-3 md:gap-4">
          {SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(selectedSize === size.id ? null : size.id)}
              className={`relative overflow-hidden transition-all duration-200 ${
                selectedSize === size.id
                  ? 'bg-pink-50 border-2 border-pink-400'
                  : 'bg-white border border-gray-100 hover:border-pink-200'
              } rounded-xl shadow-sm`}
            >
              {/* Indicateur de sélection */}
              {selectedSize === size.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}

              <div className="flex flex-row md:flex-col items-center p-4 md:p-6">
                {/* Icône */}
                <div className="flex-shrink-0 w-12 md:w-auto text-center mb-0 md:mb-3">
                  <span className="text-2xl md:text-3xl">{size.icon}</span>
                </div>

                {/* Contenu */}
                <div className="flex-1 ml-4 md:ml-0">
                  <h3 className="font-semibold text-base md:text-lg mb-1">
                    {size.name}
                  </h3>
                  <div className="flex items-center space-x-1 mb-1 text-pink-600">
                    <Ruler className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">{size.dimensions}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500">
                    {size.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServiettes.map((serviette) => {
          const slug = encodeURIComponent(serviette.name.toLowerCase().replace(/ /g, '-'));
          const sizeInfo = SIZES.find(s => s.id === serviette.size);

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
              <div className="flex flex-col flex-1 p-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-500 transition-colors">
                  {serviette.name}
                </h3>

                {(serviette.total_reviews !== undefined && serviette.total_reviews > 0) && (
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (serviette.average_rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <Link 
                      href={`/produit/${serviette.id}#reviews`}
                      className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                    >
                      {serviette.total_reviews} avis
                    </Link>
                  </div>
                )}
                {sizeInfo && (
                  <div className="mb-2 flex items-center space-x-2">
                    <span className="text-2xl">{sizeInfo.icon}</span>
                    <span className="text-sm text-gray-600">{sizeInfo.dimensions}</span>
                  </div>
                )}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {serviette.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-semibold text-pink-500">
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