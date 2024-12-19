'use client';

import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { createPayment } from '@/lib/payplug';

interface FormData {
  prenom: string;
  nom: string;
  email: string;
  adresse: string;
  codePostal: string;
  ville: string;
}

export default function CommandePage() {
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    prenom: '',
    nom: '',
    email: '',
    adresse: '',
    codePostal: '',
    ville: ''
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fraisLivraison = total >= 25 ? 0 : 4.99;

  // Vérifier si le paiement a été annulé
  const canceled = searchParams.get('canceled');
  if (canceled) {
    alert('Le paiement a été annulé. Vous pouvez réessayer quand vous voulez.');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <p>Ajoutez des articles à votre panier pour passer commande.</p>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Paris"
                />
              </div>
            </div>

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
                  <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                  <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
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
                <span>{fraisLivraison === 0 ? 'Gratuit' : `${fraisLivraison.toFixed(2)}€`}</span>
              </div>
              {fraisLivraison > 0 && (
                <p className="text-sm text-gray-500">
                  Plus que {(25 - total).toFixed(2)}€ d'achat pour la livraison gratuite !
                </p>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{(total + fraisLivraison).toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
