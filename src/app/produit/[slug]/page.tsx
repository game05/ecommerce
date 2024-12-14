// Désactive la mise en cache de la page
export const revalidate = 0;
export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Fonction pour récupérer un produit depuis Supabase par son slug
async function getProductBySlug(slug: string) {
  try {
    console.log(`Tentative de récupération du produit avec le slug ${slug} depuis Supabase...`);

    // Vérification de la connexion Supabase
    const { data: connectionTest, error: connectionError } = await supabase.from('products').select('count');
    if (connectionError) {
      console.error('Erreur de connexion à Supabase:', connectionError.message);
      throw new Error('Erreur de connexion à la base de données');
    }
    console.log('Connexion à Supabase établie');

    // Convertit le slug en nom de produit (remplace les tirets par des espaces)
    const productName = decodeURIComponent(slug.replace(/-/g, ' '));

    // Récupération du produit par son nom
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', productName)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération du produit ${productName}:`, error.message);
      throw error;
    }

    if (!data) {
      console.log(`Produit ${productName} non trouvé`);
      return null;
    }

    console.log('Produit récupéré avec succès:', data);
    return data;
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  // Vérification plus détaillée des données
  if (!product) {
    console.log(`Produit ${params.slug} non trouvé, redirection vers 404`);
    notFound();
  }

  // Vérification des champs requis
  if (!product.name || !product.image_url || !product.price) {
    console.error('Données du produit incomplètes:', product);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Erreur lors du chargement du produit
          </h2>
          <p className="mt-2 text-gray-600">
            Les informations du produit sont incomplètes. Veuillez réessayer ultérieurement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image du produit */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="eager"
          />
        </div>

        {/* Détails du produit */}
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 animate-slideUp">
              {product.name}
            </h1>
            <p className="text-lg text-pink-500 font-semibold mt-2 animate-slideUp delay-100">
              {product.price.toFixed(2)}€
            </p>
          </div>

          <div className="space-y-4 animate-slideUp delay-200">
            <p className="text-gray-600">{product.description}</p>

            {product.details && product.details.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Caractéristiques :
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.details.map((detail: string, index: number) => (
                    <li key={index} className="animate-slideUp" style={{ animationDelay: `${300 + index * 100}ms` }}>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="text-sm text-gray-600 animate-slideUp delay-300">
            {product.stock > 0 ? (
              <span className="text-green-600">En stock ({product.stock} disponibles)</span>
            ) : (
              <span className="text-red-600">Rupture de stock</span>
            )}
          </div>

          {/* Bouton de personnalisation */}
          <Link
            href={product.stock > 0 ? `/personnalisation/${encodeURIComponent(product.name.toLowerCase().replace(/ /g, '-'))}` : '#'}
            className={`w-full inline-block text-center px-6 py-3 rounded-full font-medium transition-all duration-300 animate-slideUp delay-400
              ${product.stock > 0 
                ? 'bg-pink-500 text-white hover:bg-pink-600 hover:scale-105 transform flex items-center justify-center gap-2' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            onClick={e => product.stock === 0 && e.preventDefault()}
          >
            {product.stock > 0 ? (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="animate-pulse"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Commencer la personnalisation
              </>
            ) : 'Indisponible'}
          </Link>

          {/* Informations supplémentaires */}
          <div className="border-t border-gray-200 pt-6 space-y-4 animate-slideUp delay-500">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Livraison</h3>
              <p className="mt-1 text-sm text-gray-600">
                Livraison gratuite à partir de 49€ d'achat
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Retours</h3>
              <p className="mt-1 text-sm text-gray-600">
                Retours gratuits sous 30 jours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
