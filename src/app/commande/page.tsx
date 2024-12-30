'use client';

import { useCart } from '@/hooks/useCart';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { createPayment } from '@/lib/payplug';
import { searchPointsRelais } from '@/lib/mondialrelay';
import dynamic from 'next/dynamic';
import FreeShippingBanner from '@/components/ui/FreeShippingBanner';

interface FormData {
  prenom: string;
  nom: string;
  email: string;
  adresse: string;
  codePostal: string;
  ville: string;
  livraisonMethod: 'colissimo' | 'mondialrelay' | 'retrait';
  pointRelais?: {
    id: string;
    nom: string;
    adresse: string;
    codePostal: string;
    ville: string;
    latitude?: string;
    longitude?: string;
  };
}

// Composant Map avec chargement dynamique côté client
const MapComponent = dynamic(
  () => import('@/components/MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        Chargement de la carte...
      </div>
    )
  }
);

export default function CommandePage() {
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [pointsRelais, setPointsRelais] = useState<any[]>([]);
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<FormData>({
    prenom: '',
    nom: '',
    email: '',
    adresse: '',
    codePostal: '',
    ville: '',
    livraisonMethod: 'colissimo'
  });

  // Constants pour les seuils de livraison
  const SEUIL_LIVRAISON_GRATUITE = 50;
  const FRAIS_LIVRAISON_STANDARD = 4.99;
  const ADRESSE_BOUTIQUE = "123 rue de la Boutique, 75000 Paris";
  const HORAIRES_BOUTIQUE = "Du lundi au samedi de 10h à 19h";

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fraisLivraison = formData.livraisonMethod === 'retrait' ? 0 : (total >= SEUIL_LIVRAISON_GRATUITE ? 0 : FRAIS_LIVRAISON_STANDARD);
  const montantRestantLivraisonGratuite = Math.max(0, SEUIL_LIVRAISON_GRATUITE - total);

  // Charger les points relais quand le code postal change
  useEffect(() => {
    if (formData.livraisonMethod === 'mondialrelay' && formData.codePostal.length === 5) {
      searchPointsRelais(formData.codePostal).then(points => {
        setPointsRelais(points);
      });
    }
  }, [formData.codePostal, formData.livraisonMethod]);

  // Vérifier si le paiement a été annulé
  const canceled = searchParams.get('canceled');
  if (canceled) {
    alert('Le paiement a été annulé. Vous pouvez réessayer quand vous voulez.');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await createPayment({
        amount: total + fraisLivraison,
        email: formData.email,
        first_name: formData.prenom,
        last_name: formData.nom,
        shipping_address: {
          street_address: formData.adresse,
          postcode: formData.codePostal,
          city: formData.ville,
          country: 'FR'
        }
      });

      if (!response || !response.payment_url || !response.payment_id) {
        throw new Error('Réponse de paiement invalide');
      }

      // Stocker l'ID du paiement dans le localStorage
      localStorage.setItem('current_payment_id', response.payment_id);

      // Rediriger vers l'URL de paiement PayPlug
      window.location.href = response.payment_url;
    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error);
      alert('Une erreur est survenue lors de la création du paiement. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="mb-6">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src="/images/empty-cart-cat.png"
                  alt="Panier vide"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                Votre panier est vide
              </h1>
              <p className="text-gray-600 mb-8">
                Ajoutez des articles à votre panier pour passer commande.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 transition-colors duration-200"
              >
                Retour à la boutique
              </a>
              <a
                href="/personnalisation"
                className="inline-flex items-center px-6 py-3 border border-pink-600 text-base font-medium rounded-md text-pink-600 bg-white hover:bg-pink-50 transition-colors duration-200"
              >
                Personnaliser un article
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulaire de livraison */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Informations de livraison</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm mb-1">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm mb-1">Nom</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
                placeholder="jean.dupont@example.com"
              />
            </div>

            <div>
              <label htmlFor="adresse" className="block text-sm mb-1">Adresse</label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
                placeholder="123 rue de la Paix"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="codePostal" className="block text-sm mb-1">Code postal</label>
                <input
                  type="text"
                  id="codePostal"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                  placeholder="75000"
                />
              </div>
              <div>
                <label htmlFor="ville" className="block text-sm mb-1">Ville</label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Paris"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de livraison
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.livraisonMethod === 'colissimo'
                      ? 'border-primary ring-2 ring-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, livraisonMethod: 'colissimo' }))}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.livraisonMethod === 'colissimo' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {formData.livraisonMethod === 'colissimo' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Colissimo</p>
                      <p className="text-sm text-gray-500">Livraison à domicile</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.livraisonMethod === 'mondialrelay'
                      ? 'border-primary ring-2 ring-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, livraisonMethod: 'mondialrelay' }))}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.livraisonMethod === 'mondialrelay' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {formData.livraisonMethod === 'mondialrelay' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Mondial Relay</p>
                      <p className="text-sm text-gray-500">Point relais</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all md:col-span-2 ${
                    formData.livraisonMethod === 'retrait'
                      ? 'border-primary ring-2 ring-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, livraisonMethod: 'retrait' }))}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.livraisonMethod === 'retrait' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {formData.livraisonMethod === 'retrait' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Retrait boutique</p>
                      <p className="text-sm text-gray-500">Gratuit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations de retrait en boutique */}
            {formData.livraisonMethod === 'retrait' && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Sélectionnez le point de retrait</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">La Chabroderie</h4>
                        <p className="text-sm text-gray-600">{ADRESSE_BOUTIQUE}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Horaires : </span>
                          {HORAIRES_BOUTIQUE}
                        </p>
                      </div>
                      <span className="text-rose-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Vous recevrez un email lorsque votre commande sera prête à être retirée.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Chargement...' : 'Procéder au paiement'}
            </button>
          </form>
        </div>

        {/* Récapitulatif et Point Relais */}
        <div className="space-y-8">
          {/* Récapitulatif de la commande */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Récapitulatif de la commande</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 border-b pb-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.customization && (
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        <p>
                          <span className="font-medium">Prénom :</span> {item.customization.prenom}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Motif (+3€) :</span>
                          <div className="relative w-6 h-6">
                            <Image
                              src={item.customization.motif}
                              alt="Motif personnalisé"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                      <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span>
                    {formData.livraisonMethod === 'retrait' 
                      ? 'Gratuit (Retrait en boutique)' 
                      : fraisLivraison === 0 
                        ? 'Gratuit' 
                        : `${fraisLivraison.toFixed(2)}€`}
                  </span>
                </div>
                {montantRestantLivraisonGratuite > 0 && (
                  <div className="my-2 bg-white shadow rounded-lg">
                    <FreeShippingBanner remainingAmount={montantRestantLivraisonGratuite} />
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{(total + fraisLivraison).toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Mondial Relay */}
          {formData.livraisonMethod === 'mondialrelay' && (
            <div className="mt-4 space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Sélectionnez un point relais</h3>
                {formData.codePostal.length === 5 ? (
                  pointsRelais.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Carte */}
                        <div>
                          <MapComponent
                            pointsRelais={pointsRelais}
                            selectedPointId={formData.pointRelais?.id}
                            onSelectPoint={(point) => {
                              setFormData(prev => ({
                                ...prev,
                                pointRelais: {
                                  id: point.ID,
                                  nom: point.Nom,
                                  adresse: point.Adresse1,
                                  codePostal: point.CP,
                                  ville: point.Ville,
                                  latitude: point.Latitude,
                                  longitude: point.Longitude
                                }
                              }));
                            }}
                          />
                        </div>

                        {/* Liste des points relais */}
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                            {pointsRelais.map((point) => (
                              <div
                                key={point.ID}
                                className={`p-4 hover:bg-gray-100 cursor-pointer transition-colors ${
                                  formData.pointRelais?.id === point.ID ? 'bg-rose-50 hover:bg-rose-100' : ''
                                }`}
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    pointRelais: {
                                      id: point.ID,
                                      nom: point.Nom,
                                      adresse: point.Adresse1,
                                      codePostal: point.CP,
                                      ville: point.Ville,
                                      latitude: point.Latitude,
                                      longitude: point.Longitude
                                    }
                                  }));
                                }}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium">{point.Nom}</h4>
                                    <p className="text-sm text-gray-600">{point.Adresse1}</p>
                                    <p className="text-sm text-gray-600">{point.CP} {point.Ville}</p>
                                  </div>
                                  {formData.pointRelais?.id === point.ID && (
                                    <span className="text-rose-600">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {formData.pointRelais && (
                        <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
                          <div className="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <h4 className="font-medium text-rose-800">Point Relais sélectionné :</h4>
                          </div>
                          <div className="text-rose-700">
                            <p className="font-medium">{formData.pointRelais.nom}</p>
                            <p>{formData.pointRelais.adresse}</p>
                            <p>{formData.pointRelais.codePostal} {formData.pointRelais.ville}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Aucun point relais trouvé pour ce code postal
                    </div>
                  )
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Entrez votre code postal pour voir les points relais disponibles
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}