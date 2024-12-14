import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Fonction pour récupérer un produit depuis Supabase
async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }

  return data;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image du produit */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Détails du produit */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-pink-500 font-semibold mt-2">
              {product.price.toFixed(2)}€
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">{product.description}</p>

            {product.details && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">Caractéristiques :</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.details.map((detail: string, index: number) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="text-sm text-gray-600">
            {product.stock > 0 ? (
              <span className="text-green-600">En stock ({product.stock} disponibles)</span>
            ) : (
              <span className="text-red-600">Rupture de stock</span>
            )}
          </div>

          {/* Bouton d'ajout au panier */}
          <button
            className={`w-full px-6 py-3 rounded-full font-medium transition
              ${product.stock > 0 
                ? 'bg-pink-500 text-white hover:bg-pink-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
          </button>

          {/* Informations supplémentaires */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
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
