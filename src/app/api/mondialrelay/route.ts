import { NextRequest, NextResponse } from 'next/server';
import md5 from 'md5';

interface MondialRelayConfig {
  enseigne: string;
  privateKey: string;
}

interface PointRelais {
  ID: string;
  Nom: string;
  Adresse1: string;
  CP: string;
  Ville: string;
  Latitude: string;
  Longitude: string;
}

const mondialRelayConfig: MondialRelayConfig = {
  enseigne: 'CC238UK5',
  privateKey: 'ZERuXqoF'
};

export async function POST(request: NextRequest) {
  try {
    const { codePostal } = await request.json();

    if (!codePostal) {
      return NextResponse.json(
        { error: 'Code postal manquant' },
        { status: 400 }
      );
    }

    console.log('Recherche des points relais pour le code postal:', codePostal);

    // Construction du XML SOAP
    const params = {
      Enseigne: mondialRelayConfig.enseigne,
      Pays: 'FR',
      NumPointRelais: '',
      Ville: '',
      CP: codePostal,
      Latitude: '',
      Longitude: '',
      Taille: '',
      Poids: '',
      Action: '',
      DelaiEnvoi: '0',
      RayonRecherche: '20',
      TypeActivite: '',
      NACE: '',
      NombreResultats: '10'
    };

    // Création de la clé de sécurité
    const concatenatedString = Object.values(params).join('') + mondialRelayConfig.privateKey;
    const securityKey = md5(concatenatedString).toUpperCase();

    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <WSI4_PointRelais_Recherche xmlns="http://www.mondialrelay.fr/webservice/">
      <Enseigne>${params.Enseigne}</Enseigne>
      <Pays>${params.Pays}</Pays>
      <NumPointRelais>${params.NumPointRelais}</NumPointRelais>
      <Ville>${params.Ville}</Ville>
      <CP>${params.CP}</CP>
      <Latitude>${params.Latitude}</Latitude>
      <Longitude>${params.Longitude}</Longitude>
      <Taille>${params.Taille}</Taille>
      <Poids>${params.Poids}</Poids>
      <Action>${params.Action}</Action>
      <DelaiEnvoi>${params.DelaiEnvoi}</DelaiEnvoi>
      <RayonRecherche>${params.RayonRecherche}</RayonRecherche>
      <TypeActivite>${params.TypeActivite}</TypeActivite>
      <NACE>${params.NACE}</NACE>
      <NombreResultats>${params.NombreResultats}</NombreResultats>
      <Security>${securityKey}</Security>
    </WSI4_PointRelais_Recherche>
  </soap:Body>
</soap:Envelope>`;

    console.log('Requête SOAP:', soapEnvelope);

    const response = await fetch('http://api.mondialrelay.com/Web_Services.asmx', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'http://www.mondialrelay.fr/webservice/WSI4_PointRelais_Recherche',
      },
      body: soapEnvelope,
      cache: 'no-store'
    });

    const data = await response.text();
    console.log('Réponse brute:', data);

    // Extraction du statut
    const statut = data.match(/<STAT>(\d+)<\/STAT>/)?.[1] || '';
    console.log('Statut:', statut);

    // Si le statut n'est pas présent ou différent de 0, vérifier le message d'erreur
    if (!statut || statut !== '0') {
      const errorMessage = data.match(/<Libelle>(.*?)<\/Libelle>/)?.[1] || 'Erreur inconnue';
      console.error('Erreur Mondial Relay:', errorMessage);
      return NextResponse.json(
        { error: `Erreur Mondial Relay: ${errorMessage}` },
        { status: 400 }
      );
    }

    // Extraction des points relais
    const pointsRelais: PointRelais[] = [];
    const regex = /<PointRelais_Details>([\s\S]*?)<\/PointRelais_Details>/g;
    let match;

    while ((match = regex.exec(data)) !== null) {
      const pointXML = match[1];
      const point: PointRelais = {
        ID: extractValue(pointXML, 'Num') || '',
        Nom: extractValue(pointXML, 'LgAdr1') || '',
        Adresse1: extractValue(pointXML, 'LgAdr3') || '',
        CP: extractValue(pointXML, 'CP') || '',
        Ville: extractValue(pointXML, 'Ville') || '',
        Latitude: extractValue(pointXML, 'Latitude') || '',
        Longitude: extractValue(pointXML, 'Longitude') || ''
      };

      if (point.ID && point.Nom && point.Adresse1) {
        console.log('Point relais trouvé:', point);
        pointsRelais.push(point);
      }
    }

    console.log(`${pointsRelais.length} points relais trouvés`);

    if (pointsRelais.length === 0) {
      return NextResponse.json(
        { error: 'Aucun point relais trouvé pour ce code postal' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      points: pointsRelais,
      debug: {
        statut,
        responseLength: data.length,
        firstPart: data.substring(0, 200)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la recherche des points relais:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche des points relais' },
      { status: 500 }
    );
  }
}

function extractValue(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}
