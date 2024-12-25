'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

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
        if (!data) notFound();
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

  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Colonne de gauche - Image du produit */}
          <div className="mb-8 lg:mb-0">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
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
          </div>

          {/* Colonne de droite - Personnalisation */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Personnalisation de {product.name}
            </h1>

            <div className="space-y-6">
              {/* Champ prénom */}
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  Prénom de l'enfant
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                    placeholder="Ex: Louise"
                  />
                </div>
              </div>

              {/* Sélection du motif */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Choisissez un motif
                </label>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  {motifs.map((motif, index) => (
                    <button
                      key={index}
                      onClick={() => handleMotifSelect(motif)}
                      className={`relative aspect-square rounded-lg border overflow-hidden ${
                        formData.motifSelectionne === motif
                          ? 'border-pink-500 ring-2 ring-pink-500'
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
              <button
                type="submit"
                className="mt-8 w-full bg-pink-600 py-3 px-4 rounded-md text-white font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Valider la personnalisation
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
