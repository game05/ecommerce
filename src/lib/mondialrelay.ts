'use client';

interface PointRelais {
  ID: string;
  Nom: string;
  Adresse1: string;
  CP: string;
  Ville: string;
  Latitude: string;
  Longitude: string;
}

export async function searchPointsRelais(codePostal: string): Promise<PointRelais[]> {
  try {
    console.log('Recherche des points relais pour le code postal:', codePostal);

    const response = await fetch('/api/mondialrelay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codePostal }),
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur de l\'API:', data.error || 'Erreur inconnue');
      return [];
    }

    if (data.error) {
      console.error('Erreur de l\'API:', data.error);
      return [];
    }

    if (!data.points || !Array.isArray(data.points)) {
      console.error('Format de réponse invalide:', data);
      return [];
    }

    // Afficher les informations de débogage
    if (data.debug) {
      console.log('Informations de débogage:', data.debug);
    }

    if (data.points.length === 0) {
      console.log('Aucun point relais trouvé pour ce code postal');
    } else {
      console.log(`${data.points.length} points relais trouvés`);
    }

    return data.points;
  } catch (error) {
    console.error('Erreur lors de la recherche des points relais:', error);
    return [];
  }
}
