import { supabase } from './supabase';

export interface ShippingItem {
  id: number;
  quantity: number;
  weight: number;
}

export async function calculateShippingCost(items: ShippingItem[], method: 'colissimo' | 'mondialrelay' | 'retrait'): Promise<number> {
  if (method === 'retrait') return 0;
  
  // Calculer le poids total
  const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
  
  if (method === 'colissimo') {
    // Utiliser la fonction SQL pour calculer les frais Colissimo
    const { data, error } = await supabase
      .rpc('calculate_colissimo_shipping_cost', {
        weight_in_grams: totalWeight
      });
      
    if (error) {
      console.error('Erreur lors du calcul des frais Colissimo:', error);
      return 0;
    }
    
    return data || 0;
  }
  
  // Pour Mondial Relay, on peut définir une autre grille tarifaire ici
  if (method === 'mondialrelay') {
    return 4.99; // Prix fixe pour Mondial Relay
  }
  
  return 0;
}
