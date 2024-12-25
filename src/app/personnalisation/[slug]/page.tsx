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

// Liste des motifs disponibles
const motifs = [
  '/motif/motif1.png',
  '/motif/motif2.png',
  '/motif/motif3.png',
  '/motif/motif4.png'
];

export default function PersonnalisationPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    prenom: '',
    motifSelectionne: ''
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

  const handleMotifSelect = (motif: string) => {
    setFormData(prev => ({
      ...prev,
      motifSelectionne: motif
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
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
      {/* Header plus compact */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-1">
            <p className="text-pink-600 text-sm font-medium">Personnalisation</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Colonne de gauche : Image du produit */}
            <div className="relative">
              <div className="p-6">
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {formData.motifSelectionne && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={formData.motifSelectionne}
                        alt="Motif sélectionné"
                        width={150}
                        height={150}
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Aperçu en temps réel de votre personnalisation
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne de droite : Formulaire de personnalisation */}
            <div className="relative">
              <div className="p-6 bg-gradient-to-br from-white to-pink-50 h-full">
                <div className="max-w-md mx-auto space-y-6">
                  {/* Section Prénom */}
                  <div className="space-y-2">
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-900">
                      Prénom de l'enfant
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-200"
                        placeholder="Ex: Louise"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <span className="text-pink-400 text-sm">✨</span>
                      </div>
                    </div>
                  </div>

                  {/* Section Motifs */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Choisissez un motif
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {motifs.map((motif, index) => (
                        <button
                          key={index}
                          onClick={() => handleMotifSelect(motif)}
                          className={`relative aspect-square rounded-lg overflow-hidden border transition-all duration-200 ${
                            formData.motifSelectionne === motif
                              ? 'border-pink-500 ring-1 ring-pink-200'
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <Image
                            src={motif}
                            alt={`Motif ${index + 1}`}
                            fill
                            className="object-contain p-2"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bouton de validation */}
                  <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
                    Valider ma personnalisation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
