'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

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

// Prix du motif
const MOTIF_PRICE = 3;

export default function PersonnalisationPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const { addToCart, openCart } = useCart();
  const [formData, setFormData] = useState({
    prenom: '',
    motifSelectionne: '',
    wantMotif: false
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

  useEffect(() => {
    const updateCartIconPosition = () => {
      const cartIcon = document.querySelector('.cart-icon');
      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect();
        // setCartIconPosition({
        //   x: rect.right - 20,
        //   y: rect.top + rect.height / 2
        // });
      }
    };

    updateCartIconPosition();
    window.addEventListener('resize', updateCartIconPosition);
    const interval = setInterval(updateCartIconPosition, 1000);

    return () => {
      window.removeEventListener('resize', updateCartIconPosition);
      clearInterval(interval);
    };
  }, []);

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

  const nextStep = () => {
    if (currentStep === 1 && !formData.prenom) {
      alert('Veuillez entrer un prénom');
      return;
    }
    if (currentStep === 2 && formData.wantMotif && !formData.motifSelectionne) {
      alert('Veuillez sélectionner un motif');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
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
                    width={100}
                    height={100}
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

            {/* Indicateur d'étapes en dessous du titre */}
            <div className="mb-8">
              <div className="hidden md:flex items-center gap-6">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 1 ? 'border-pink-600 bg-pink-50' : 'border-gray-300'
                  }`}>
                    1
                  </div>
                  <span className="ml-3 text-sm font-medium">Prénom</span>
                </div>
                <div className="w-16">
                  <div className={`h-0.5 ${currentStep >= 2 ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 2 ? 'border-pink-600 bg-pink-50' : 'border-gray-300'
                  }`}>
                    2
                  </div>
                  <span className="ml-3 text-sm font-medium">Motif</span>
                </div>
                <div className="w-16">
                  <div className={`h-0.5 ${currentStep >= 3 ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`flex items-center ${currentStep >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 3 ? 'border-pink-600 bg-pink-50' : 'border-gray-300'
                  }`}>
                    3
                  </div>
                  <span className="ml-3 text-sm font-medium">Récapitulatif</span>
                </div>
              </div>

              {/* Version mobile des étapes */}
              <div className="flex md:hidden justify-between px-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 1 ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-gray-300 text-gray-400'
                  }`}>
                    1
                  </div>
                  <span className={`mt-1 text-xs font-medium ${
                    currentStep >= 1 ? 'text-pink-600' : 'text-gray-400'
                  }`}>Prénom</span>
                </div>

                <div className="flex flex-col items-center relative">
                  <div className="absolute top-4 -left-[calc(50%+1rem)] w-[calc(100%+2rem)] h-0.5 bg-gray-200">
                    <div className={`h-full bg-pink-600 transition-all duration-300 ${
                      currentStep >= 2 ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 2 ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-gray-300 text-gray-400'
                  }`}>
                    2
                  </div>
                  <span className={`mt-1 text-xs font-medium ${
                    currentStep >= 2 ? 'text-pink-600' : 'text-gray-400'
                  }`}>Motif</span>
                </div>

                <div className="flex flex-col items-center relative">
                  <div className="absolute top-4 -left-[calc(50%+1rem)] w-[calc(100%+2rem)] h-0.5 bg-gray-200">
                    <div className={`h-full bg-pink-600 transition-all duration-300 ${
                      currentStep >= 3 ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 3 ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-gray-300 text-gray-400'
                  }`}>
                    3
                  </div>
                  <span className={`mt-1 text-xs font-medium ${
                    currentStep >= 3 ? 'text-pink-600' : 'text-gray-400'
                  }`}>Récap</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {currentStep === 1 ? (
                /* Étape 1 : Prénom avec design amélioré */
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <label htmlFor="prenom" className="block text-base font-medium text-gray-700 mb-3">
                    Quel prénom souhaitez-vous broder ?
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-lg transition-all duration-200"
                      placeholder="Ex: Louise"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-pink-400">✨</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Ce prénom sera brodé avec soin sur votre article
                  </p>
                </div>
              ) : currentStep === 2 ? (
                /* Étape 2 : Motifs */
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Souhaitez-vous ajouter un motif ?</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      L'ajout d'un motif est optionnel et coûte 3€ supplémentaires
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            wantMotif: true,
                            motifSelectionne: ''
                          }));
                        }}
                        className={`flex-1 py-3 px-4 rounded-lg border ${
                          formData.wantMotif
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-300 hover:border-pink-300'
                        }`}
                      >
                        Oui, je veux un motif
                      </button>
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            wantMotif: false,
                            motifSelectionne: ''
                          }));
                        }}
                        className={`flex-1 py-3 px-4 rounded-lg border ${
                          formData.wantMotif === false
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-300 hover:border-pink-300'
                        }`}
                      >
                        Non, sans motif
                      </button>
                    </div>
                  </div>
                  
                  {formData.wantMotif && (
                    <>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">Choisissez un motif</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                          +3€
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Ajoutez une touche unique à votre article avec un joli motif
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {motifs.map((motif, index) => (
                          <button
                            key={index}
                            onClick={() => handleMotifSelect(motif)}
                            className={`relative aspect-square rounded-lg border overflow-hidden p-1.5 ${
                              formData.motifSelectionne === motif
                                ? 'border-pink-500 ring-2 ring-pink-500'
                                : 'border-gray-200 hover:border-pink-300'
                            }`}
                          >
                            <div className="relative w-20 h-20 mx-auto">
                              <Image
                                src={motif}
                                alt={`Motif ${index + 1}`}
                                fill
                                className="object-contain"
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Étape 3 : Récapitulatif */
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif de votre personnalisation</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Prénom</p>
                        <p className="text-base font-medium text-gray-900">{formData.prenom}</p>
                      </div>
                      <button 
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-pink-600 hover:text-pink-800"
                      >
                        Modifier
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Motif {formData.wantMotif ? '(+3€)' : ''}</p>
                        {formData.wantMotif ? (
                          <div className="w-16 h-16 relative mt-1">
                            <Image
                              src={formData.motifSelectionne}
                              alt="Motif sélectionné"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <p className="text-base font-medium text-gray-900">Sans motif</p>
                        )}
                      </div>
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="text-sm text-pink-600 hover:text-pink-800"
                      >
                        Modifier
                      </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <p className="text-base font-medium text-gray-900">Prix total</p>
                        <p className="text-base font-medium text-gray-900">
                          {product ? `${(product.price + (formData.wantMotif && formData.motifSelectionne ? MOTIF_PRICE : 0)).toFixed(2)}€` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation entre les étapes */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Retour
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="ml-auto px-6 py-3 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700 transition-colors duration-200"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (product) {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price + (formData.wantMotif && formData.motifSelectionne ? MOTIF_PRICE : 0),
                          image_url: product.image_url,
                          quantity: 1,
                          customization: {
                            prenom: formData.prenom,
                            motif: formData.motifSelectionne
                          }
                        });
                        openCart();
                      }
                    }}
                    className="ml-auto px-6 py-3 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700 transition-colors duration-200"
                  >
                    Ajouter au panier
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
