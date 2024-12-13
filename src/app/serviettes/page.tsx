import Image from 'next/image';

export default function ServiettesPage() {
  const serviettes = [
    {
      id: 1,
      name: 'Serviette de bain bébé - Rose',
      description: 'Serviette douce et absorbante avec capuche, parfaite pour bébé',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1617331140180-e8262094733a?w=800&q=80'
    },
    {
      id: 3,
      name: 'Set de serviettes bébé',
      description: 'Lot de 3 serviettes douces pour le bain de bébé',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
    },
    {
      id: 4,
      name: 'Serviette de plage bébé',
      description: 'Grande serviette absorbante, idéale pour la plage',
      price: 27.99,
      image: 'https://images.unsplash.com/photo-1616627577385-5c0c4dab0257?w=800&q=80'
    },
    {
      id: 5,
      name: 'Cape de bain bébé',
      description: 'Cape de bain douce avec oreilles mignonnes',
      price: 32.99,
      image: 'https://images.unsplash.com/photo-1619784299133-f691ffaea42f?w=800&q=80'
    },
    {
      id: 6,
      name: 'Serviette personnalisée',
      description: 'Serviette brodée avec le prénom de bébé',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=800&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Serviettes</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez notre collection de serviettes douces et absorbantes, 
          spécialement conçues pour le confort de votre bébé.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviettes.map((serviette) => (
          <div 
            key={serviette.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={serviette.image}
                alt={serviette.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {serviette.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {serviette.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-pink-500">
                  {serviette.price.toFixed(2)} €
                </span>
                <button className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition">
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Qualité Premium</h3>
          <p className="text-gray-600">Matériaux doux et absorbants pour le confort de bébé</p>
        </div>
        <div className="text-center">
          <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Lavage Facile</h3>
          <p className="text-gray-600">Résistantes aux lavages fréquents</p>
        </div>
        <div className="text-center">
          <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Hypoallergénique</h3>
          <p className="text-gray-600">Sans produits chimiques nocifs</p>
        </div>
      </div>
    </div>
  );
}
