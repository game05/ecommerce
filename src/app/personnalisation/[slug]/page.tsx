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
  '/motif/Voiture pompier_10x7cm.png',
  '/motif/tracteur vert 1.png',
  '/motif/vache serviette fuchia.png',
  '/motif/violon nanou.png'
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
      {/* Header élégant */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-2">
            <p className="text-pink-600 font-medium">Personnalisation</p>
            <h1 className="text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Créez un cadeau unique et personnalisé
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Colonne de gauche : Image du produit */}
            <div className="relative">
              <div className="p-8">
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
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
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Aperçu en temps réel</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Visualisez vos modifications directement sur le produit
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne de droite : Formulaire de personnalisation */}
            <div className="relative">
              <div className="p-8 lg:p-12 bg-gradient-to-br from-white to-pink-50 h-full">
                <div className="max-w-md mx-auto space-y-10">
                  {/* Section Prénom */}
                  <div className="space-y-4">
                    <label htmlFor="prenom" className="block text-xl font-medium text-gray-900">
                      Prénom de l'enfant
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-200 text-lg"
                        placeholder="Ex: Louise"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <span className="text-pink-400">✨</span>
                      </div>
                    </div>
                  </div>

                  {/* Section Motifs */}
                  <div className="space-y-4">
                    <label className="block text-xl font-medium text-gray-900">
                      Choisissez un motif
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {motifs.map((motif, index) => (
                        <button
                          key={index}
                          onClick={() => handleMotifSelect(motif)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            formData.motifSelectionne === motif
                              ? 'border-pink-500 ring-2 ring-pink-200'
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
                  <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-5 rounded-xl hover:from-pink-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl">
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
