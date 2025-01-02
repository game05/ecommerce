import Image from 'next/image';
import Link from 'next/link';
import { PromoBadge } from '@/components/ui/PromoBadge';

export default function Home() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Tout pour le{' '}
                  <span className="text-pink-500 block">bonheur de bébé</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Découvrez notre sélection de produits de qualité pour accompagner les premiers pas de votre enfant
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/nouveautes"
                  className="bg-pink-500 text-white px-6 md:px-8 py-3 rounded-full hover:bg-pink-600 transition font-medium"
                >
                  Voir les nouveautés
                </Link>
                <Link
                  href="/categories"
                  className="border-2 border-gray-900 text-gray-900 px-6 md:px-8 py-3 rounded-full hover:bg-gray-900 hover:text-white transition font-medium"
                >
                  Nos catégories
                </Link>
              </div>
            </div>

            {/* Image Section with Promo Badges */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/header-img.jpg"
                  alt="La Chabroderie Boutique"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Promo Badges */}
              <PromoBadge
                text="Livraison gratuite"
                subText="dès 49€ d'achat"
                className="absolute -top-4 -right-4 z-10 scale-90 md:scale-100"
                direction="up"
              />
              <PromoBadge
                text="-20%"
                subText="sur les poussettes"
                className="absolute -bottom-4 left-8 z-10 scale-90 md:scale-100"
                direction="down"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 relative">
            <span className="text-pink-500 text-sm font-medium tracking-wider uppercase mb-2 block">Fait avec amour</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Nos collections</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Découvrez nos créations uniques pour votre bébé, fabriquées avec soin et attention aux détails</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Collection Serviettes */}
            <div className="group relative overflow-visible rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2 bg-pink-50 mt-3">
              <div className="absolute -top-3 left-5">
                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-pink-500 shadow-sm">Nouveauté</div>
              </div>
              <Link href="/serviettes" className="block">
                <div className="p-5 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">Serviettes</h3>
                    <p className="text-gray-600 text-sm">Personnalisez vos serviettes avec nos motifs uniques</p>
                  </div>
                  <div className="inline-flex items-center text-sm font-medium bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-300 rounded-full px-4 py-2 mt-4 self-start">
                    Découvrir la collection
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Collection Bavoirs */}
            <div className="group relative overflow-visible rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2 bg-pink-50 mt-3">
              <div className="absolute -top-3 left-5">
                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-pink-500 shadow-sm">Populaire</div>
              </div>
              <Link href="/bavoirs" className="block">
                <div className="p-5 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">Bavoirs</h3>
                    <p className="text-gray-600 text-sm">Des bavoirs doux et absorbants pour les repas de bébé</p>
                  </div>
                  <div className="inline-flex items-center text-sm font-medium bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-300 rounded-full px-4 py-2 mt-4 self-start">
                    Découvrir la collection
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* Collection Accessoires */}
            <div className="group relative overflow-visible rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2 bg-pink-50 mt-3">
              <div className="absolute -top-3 left-5">
                <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white bg-pink-500 shadow-sm">Essentiel</div>
              </div>
              <Link href="/accessoires" className="block">
                <div className="p-5 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">Accessoires</h3>
                    <p className="text-gray-600 text-sm">Tous les accessoires essentiels pour le quotidien</p>
                  </div>
                  <div className="inline-flex items-center text-sm font-medium bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-300 rounded-full px-4 py-2 mt-4 self-start">
                    Découvrir la collection
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Améliorées */}
      <section className="bg-gradient-to-b from-pink-50/50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Livraison Rapide */}
            <div className="relative group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-300">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Livraison Rapide</h3>
                  <p className="text-gray-600">Livraison en 24/48h partout en France</p>
                </div>
                <div className="absolute -inset-4 border border-pink-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Paiement Sécurisé */}
            <div className="relative group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-300">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Paiement Sécurisé</h3>
                  <p className="text-gray-600">Transactions sécurisées via PayPlug</p>
                </div>
                <div className="absolute -inset-4 border border-pink-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Service Client */}
            <div className="relative group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-300">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Service Client</h3>
                  <p className="text-gray-600">Une équipe à votre écoute 7j/7</p>
                </div>
                <div className="absolute -inset-4 border border-pink-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
