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

type PersonnalisationSettings = {
  id: string;
  product_id: number;
  text_position_x: number;
  text_position_y: number;
  text_size: number;
  motif_position_x: number;
  motif_position_y: number;
  motif_size: number;
  can_move_text: boolean;
  can_move_motif: boolean;
};

// Liste des motifs disponibles
const motifs = [
  '/motif/motif1.png',
  '/motif/motif2.png',
  '/motif/motif3.png',
  '/motif/motif4.png'
];

// Liste des couleurs de broderie disponibles
const broderingColors = [
  { id: 'white', name: 'Blanc', hex: '#FFFFFF', border: true },
  { id: 'black', name: 'Noir', hex: '#000000' },
  { id: 'navy', name: 'Bleu Marine', hex: '#000080' },
  { id: 'pink', name: 'Rose', hex: '#FF69B4' },
  { id: 'red', name: 'Rouge', hex: '#FF0000' },
  { id: 'gold', name: 'Or', hex: '#FFD700' },
  { id: 'silver', name: 'Argent', hex: '#C0C0C0', border: true }
];

// Prix du motif
const MOTIF_PRICE = 3;

export default function PersonnalisationPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const { addToCart, openCart } = useCart();
  const [personnalisation, setPersonnalisation] = useState<PersonnalisationSettings | null>(null);
  const [formData, setFormData] = useState({
    prenom: '',
    broderingColor: 'white',
    motifSelectionne: '',
    wantMotif: false,
    textPosition: { x: 50, y: 50 },
    textSize: 3,
    motifPosition: { x: 50, y: 50 },
    motifSize: 3
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startResizePosition, setStartResizePosition] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState(3);
  const [draggedElement, setDraggedElement] = useState<'text' | 'motif' | null>(null);
  const [resizedElement, setResizedElement] = useState<'text' | 'motif' | null>(null);

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;
      
      const { data: user } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      return user?.role === 'admin';
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle:', error);
      return false;
    }
  };

  // Gestionnaires de drag pour le texte et le motif
  const handleDragStart = (element: 'text' | 'motif') => async (e: React.MouseEvent<HTMLDivElement>) => {
    // Vérifier si le déplacement est autorisé
    if (element === 'text' && !personnalisation?.can_move_text) {
      const admin = await isAdmin();
      if (!admin) return;
    }
    if (element === 'motif' && !personnalisation?.can_move_motif) {
      const admin = await isAdmin();
      if (!admin) return;
    }

    setIsDragging(true);
    setDraggedElement(element);
    e.preventDefault();
  };

  // Gestionnaires de redimensionnement pour le texte et le motif
  const handleResizeStart = (element: 'text' | 'motif') => async (e: React.MouseEvent<HTMLDivElement>) => {
    // Vérifier si le redimensionnement est autorisé
    if (element === 'text' && !personnalisation?.can_move_text) {
      const admin = await isAdmin();
      if (!admin) return;
    }
    if (element === 'motif' && !personnalisation?.can_move_motif) {
      const admin = await isAdmin();
      if (!admin) return;
    }

    setIsResizing(true);
    setResizedElement(element);
    setStartResizePosition({ x: e.clientX, y: e.clientY });
    setStartSize(element === 'text' ? formData.textSize : formData.motifSize);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedElement(null);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizedElement(null);
  };

  useEffect(() => {
    async function getProduct() {
      try {
        const decodedSlug = decodeURIComponent(params.slug);
        const productName = decodedSlug.replace(/-/g, ' ');
        
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .ilike('name', productName)
          .single();

        if (productError) throw productError;
        if (!productData) notFound();
        
        setProduct(productData);
        console.log('Produit récupéré:', productData);

        // Récupérer les paramètres de personnalisation
        const { data: personnalisationData, error: personnalisationError } = await supabase
          .from('personnalisation')
          .select('*')
          .eq('product_id', productData.id)
          .single();

        if (personnalisationError) {
          console.error('Erreur lors de la récupération de la personnalisation:', personnalisationError);
        }

        if (personnalisationData) {
          console.log('Personnalisation récupérée:', personnalisationData);
          setPersonnalisation(personnalisationData);
          // Mettre à jour formData avec les valeurs de personnalisation
          setFormData(prev => ({
            ...prev,
            textPosition: { 
              x: personnalisationData.text_position_x, 
              y: personnalisationData.text_position_y 
            },
            textSize: personnalisationData.text_size,
            motifPosition: { 
              x: personnalisationData.motif_position_x, 
              y: personnalisationData.motif_position_y 
            },
            motifSize: personnalisationData.motif_size
          }));
        } else {
          console.log('Aucune personnalisation trouvée pour le produit:', productData.id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [params.slug]);

  useEffect(() => {
    const handleMouseMove = async (e: MouseEvent) => {
      if (isResizing && resizedElement) {
        const deltaX = e.clientX - startResizePosition.x;
        const scale = 0.01;
        const newSize = Math.max(1, startSize + (deltaX * scale));
        
        setFormData(prev => ({
          ...prev,
          [resizedElement === 'text' ? 'textSize' : 'motifSize']: newSize
        }));
      } else if (isDragging && draggedElement) {
        const container = document.querySelector('.product-image-container');
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const boundedX = Math.min(Math.max(x, 0), 100);
        const boundedY = Math.min(Math.max(y, 0), 100);

        setFormData(prev => ({
          ...prev,
          [draggedElement === 'text' ? 'textPosition' : 'motifPosition']: { x: boundedX, y: boundedY }
        }));
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        handleResizeEnd();
      }
      if (isDragging) {
        handleDragEnd();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, draggedElement, resizedElement, startResizePosition.x, startResizePosition.y, startSize]);

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

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !draggedElement) return;
    
    const container = e.currentTarget.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const boundedX = Math.min(Math.max(x, 0), 100);
    const boundedY = Math.min(Math.max(y, 0), 100);

    setFormData(prev => ({
      ...prev,
      [draggedElement === 'text' ? 'textPosition' : 'motifPosition']: { x: boundedX, y: boundedY }
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
          {/* Colonne de gauche - Image du produit et valeurs */}
          <div className="mb-8 lg:mb-0">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 mx-auto max-w-[95%] product-image-container mb-4">
              <div className="absolute inset-0 p-4">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Prénom brodé */}
                {formData.prenom && (
                  <div 
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-center select-none font-serif font-medium tracking-wide -rotate-6
                      ${isDragging && draggedElement === 'text' ? 'cursor-grabbing' : personnalisation?.can_move_text ? 'cursor-grab' : ''}`}
                    style={{
                      left: `${formData.textPosition.x}%`,
                      top: `${formData.textPosition.y}%`,
                      fontSize: `${formData.textSize}rem`,
                      color: formData.broderingColor === 'white' ? 'black' : formData.broderingColor,
                      textShadow: formData.broderingColor === 'white' ? '0 0 2px rgba(0,0,0,0.3)' : 'none'
                    }}
                    onMouseDown={handleDragStart('text')}
                  >
                    {formData.prenom || 'Prénom'}
                    {/* Poignée de redimensionnement pour le texte */}
                    {personnalisation?.can_move_text && (
                      <div
                        className="absolute bottom-0 right-0 w-4 h-4 bg-pink-500 rounded-full cursor-se-resize transform translate-x-1/2 translate-y-1/2 opacity-50 hover:opacity-100"
                        onMouseDown={handleResizeStart('text')}
                      />
                    )}
                  </div>
                )}

                {/* Motif */}
                {formData.wantMotif && formData.motifSelectionne && (
                  <div
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 select-none
                      ${isDragging && draggedElement === 'motif' ? 'cursor-grabbing' : personnalisation?.can_move_motif ? 'cursor-grab' : ''}`}
                    style={{
                      left: `${formData.motifPosition.x}%`,
                      top: `${formData.motifPosition.y}%`,
                      width: `${formData.motifSize * 2}rem`,
                      height: `${formData.motifSize * 2}rem`
                    }}
                    onMouseDown={handleDragStart('motif')}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={formData.motifSelectionne}
                        alt="Motif personnalisé"
                        fill
                        className="object-contain"
                      />
                      {/* Poignée de redimensionnement pour le motif */}
                      {personnalisation?.can_move_motif && (
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 bg-pink-500 rounded-full cursor-se-resize transform translate-x-1/2 translate-y-1/2 opacity-50 hover:opacity-100"
                          onMouseDown={handleResizeStart('motif')}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Affichage des valeurs pour copier dans Supabase */}
            {personnalisation?.can_move_text && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Position du texte :</h3>
                <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm">
                  <pre className="whitespace-pre-wrap break-all">
{JSON.stringify({
  text_position_x: Number(formData.textPosition.x.toFixed(2)),
  text_position_y: Number(formData.textPosition.y.toFixed(2)),
  text_size: Number(formData.textSize.toFixed(2))
}, null, 2)}</pre>
                </div>
              </div>
            )}
            {personnalisation?.can_move_motif && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Position du motif :</h3>
                <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm">
                  <pre className="whitespace-pre-wrap break-all">
{JSON.stringify({
  motif_position_x: Number(formData.motifPosition.x.toFixed(2)),
  motif_position_y: Number(formData.motifPosition.y.toFixed(2)),
  motif_size: Number(formData.motifSize.toFixed(2))
}, null, 2)}</pre>
                </div>
              </div>
            )}
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
              <div className="flex md:hidden justify-between px-4 relative">
                {/* Barres de progression en arrière-plan */}
                <div className="absolute top-4 left-[calc(25%-1rem)] right-[calc(25%-1rem)] h-0.5 bg-gray-200">
                  <div className={`h-full bg-pink-600 transition-all duration-300 ${
                    currentStep >= 2 ? currentStep >= 3 ? 'w-full' : 'w-1/2' : 'w-0'
                  }`}></div>
                </div>

                {/* Étapes */}
                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white ${
                    currentStep >= 1 ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-gray-300 text-gray-400'
                  }`}>
                    1
                  </div>
                  <span className={`mt-1 text-xs font-medium ${
                    currentStep >= 1 ? 'text-pink-600' : 'text-gray-400'
                  }`}>Prénom</span>
                </div>

                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white ${
                    currentStep >= 2 ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-gray-300 text-gray-400'
                  }`}>
                    2
                  </div>
                  <span className={`mt-1 text-xs font-medium ${
                    currentStep >= 2 ? 'text-pink-600' : 'text-gray-400'
                  }`}>Motif</span>
                </div>

                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white ${
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
                /* Étape 1 : Prénom et couleur de broderie */
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                  {/* Champ prénom */}
                  <div>
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

                  {/* Sélection de la couleur de broderie */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">
                      Choisissez la couleur de la broderie
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {broderingColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setFormData(prev => ({ ...prev, broderingColor: color.id }))}
                          className={`relative flex flex-col items-center p-2 rounded-lg transition-all ${
                            formData.broderingColor === color.id
                              ? 'ring-2 ring-pink-500 border-transparent'
                              : 'border border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <div 
                            className={`w-8 h-8 rounded-full mb-1 ${color.border ? 'border border-gray-200' : ''}`}
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs font-medium text-gray-700">{color.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      La couleur sélectionnée sera utilisée pour broder le prénom
                    </p>
                  </div>
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
                        <p className="text-sm font-medium text-gray-500">Couleur de broderie</p>
                        <p className="text-base font-medium text-gray-900">{broderingColors.find(color => color.id === formData.broderingColor)?.name}</p>
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
                            broderingColor: formData.broderingColor,
                            motif: formData.motifSelectionne,
                            textPosition: formData.textPosition,
                            textSize: formData.textSize,
                            motifPosition: formData.motifPosition,
                            motifSize: formData.motifSize
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
