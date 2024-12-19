'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Types
type Step = {
  id: number;
  title: string;
  description: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
};

// Définition des étapes de personnalisation
const steps: Step[] = [
  {
    id: 1,
    title: "Choix du motif",
    description: "Sélectionnez le motif que vous souhaitez broder"
  },
  {
    id: 2,
    title: "Personnalisation du texte",
    description: "Ajoutez le texte de votre choix (nom, date, message...)"
  },
  {
    id: 3,
    title: "Choix des couleurs",
    description: "Sélectionnez les couleurs pour votre broderie"
  }
];

export default function PersonnalisationPage({ params }: { params: { slug: string } }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    motif: '',
    texte: '',
    couleurs: [],
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

  // Fonction pour aller à l'étape suivante
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
      {/* Header avec les étapes */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Personnalisation de {product.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
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

            {/* Colonne de droite : Options de personnalisation */}
            <div className="p-6">
              {/* Étapes de personnalisation */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-center ${
                        step.id === currentStep
                          ? 'text-pink-600'
                          : step.id < currentStep
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                        ${
                          step.id === currentStep
                            ? 'border-pink-600 bg-pink-50'
                            : step.id < currentStep
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {step.id < currentStep ? (
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          step.id
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description de l'étape actuelle */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="mt-2 text-gray-600">
                  {steps[currentStep - 1].description}
                </p>
              </div>

              {/* Contenu de l'étape */}
              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Motifs à ajouter */}
                  {['Motif 1', 'Motif 2', 'Motif 3', 'Motif 4'].map((motif, index) => (
                    <button
                      key={index}
                      className="aspect-square rounded-lg border-2 border-gray-200 hover:border-pink-500 transition-colors duration-200 p-4 flex items-center justify-center"
                    >
                      {motif}
                    </button>
                  ))}
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="texte" className="block text-sm font-medium text-gray-700">
                      Votre texte personnalisé
                    </label>
                    <input
                      type="text"
                      id="texte"
                      name="texte"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Ex: Louise - 12/05/2023"
                    />
                  </div>
                  <div>
                    <label htmlFor="police" className="block text-sm font-medium text-gray-700">
                      Police d'écriture
                    </label>
                    <select
                      id="police"
                      name="police"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    >
                      <option>Script élégant</option>
                      <option>Moderne simple</option>
                      <option>Classique serif</option>
                    </select>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur principale
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {['#FF69B4', '#4169E1', '#FFD700', '#98FB98', '#DDA0DD', '#F08080'].map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur secondaire
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {['#FF69B4', '#4169E1', '#FFD700', '#98FB98', '#DDA0DD', '#F08080'].map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation entre les étapes */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Précédent
                </button>
                <button
                  onClick={nextStep}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    currentStep === steps.length
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'bg-pink-500 text-white hover:bg-pink-600'
                  }`}
                  disabled={currentStep === steps.length}
                >
                  Suivant
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
