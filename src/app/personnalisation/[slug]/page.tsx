'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
};

export default function PersonnalisationPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    prenom: '',
    dateNaissance: '',
  });

  useEffect(() => {
    async function getProduct() {
      try {
        const decodedSlug = decodeURIComponent(params.slug);
        const productName = decodedSlug.replace(/-/g, ' ');
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('name', productName)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [params.slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Produit non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Personnalisation de {product.name}
          </h1>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Colonne de gauche : Image du produit */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Aperçu en temps réel</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Visualisez vos modifications en direct sur le produit
                </p>
              </div>
            </div>

            {/* Colonne de droite : Formulaire de personnalisation */}
            <div className="p-8">
              <div className="max-w-md mx-auto space-y-8">
                {/* Section Prénom */}
                <div className="space-y-4">
                  <label htmlFor="prenom" className="block text-lg font-semibold text-gray-900">
                    Prénom de l'enfant
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ex: Louise"
                  />
                </div>

                {/* Section Date de naissance */}
                <div className="space-y-4">
                  <label htmlFor="dateNaissance" className="block text-lg font-semibold text-gray-900">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    id="dateNaissance"
                    name="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Bouton de validation */}
                <button
                  className="w-full bg-pink-500 text-white py-4 rounded-lg hover:bg-pink-600 transition-colors duration-200 font-semibold mt-8"
                >
                  Valider la personnalisation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
