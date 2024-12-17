'use client';

import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import Image from 'next/image';
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

      localStorage.setItem('current_payment_id', response.payment_id);
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
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors mt-6"
            >
              {isLoading ? 'Chargement...' : 'Procéder au paiement'}
            </button>
          </form>

          <div className="flex justify-between items-center mt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
              </svg>
              <span>Livraison gratuite dès 25.0€ d'achat</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Paiement sécurisé Par PayPlug</span>
            </div>
          </div>
        </div>

        {/* Récapitulatif */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Récapitulatif</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-4 last:mb-0">
                <div className="relative w-16 h-16">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                  <span className="absolute -top-2 -right-2 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-primary">{item.price.toFixed(2)}€</p>
                </div>
              </div>
            ))}

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{fraisLivraison.toFixed(2)}€</span>
              </div>
              {total < 25 && (
                <div className="bg-pink-50 p-3 rounded text-sm text-pink-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                    <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                  </svg>
                  Plus que {(25 - total).toFixed(2)}€ pour la livraison gratuite !
                </div>
              )}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-semibold">
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
