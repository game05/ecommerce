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

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: 'Livraison Rapide',
                description: 'Livraison en 24/48h partout en France',
              },
              {
                title: 'Paiement Sécurisé',
                description: 'Transactions sécurisées via PayPlug',
              },
              {
                title: 'Service Client',
                description: 'Une équipe à votre écoute 7j/7',
              },
            ].map((feature) => (
              <div key={feature.title} className="space-y-4">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
