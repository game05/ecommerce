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

      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              Nos Collections
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Découvrez notre univers enchanteur pour votre tout-petit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: 'Vêtements',
                description: 'Des créations uniques et douces pour le confort de bébé',
                image: '/categories/vetements.jpg',
                link: '/categories/vetements',
                accent: 'from-pink-500 to-rose-600'
              },
              {
                title: 'Accessoires',
                description: 'Les petits détails qui font toute la différence',
                image: '/categories/accessoires.jpg',
                link: '/categories/accessoires',
                accent: 'from-purple-500 to-indigo-600'
              },
              {
                title: 'Décoration',
                description: 'Pour créer un cocon douillet et magique',
                image: '/categories/decoration.jpg',
                link: '/categories/decoration',
                accent: 'from-blue-500 to-cyan-600'
              },
            ].map((category) => (
              <Link
                href={category.link}
                key={category.title}
                className="group relative block"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  {/* Image Container */}
                  <div className="relative h-[400px]">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Overlay gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
                    <div className={`absolute inset-0 bg-gradient-to-tr ${category.accent} mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  </div>

                  {/* Content Container */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500" />
                    
                    {/* Text content */}
                    <div className="relative transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                      <h3 className="text-3xl font-bold text-white mb-3 tracking-wide">
                        {category.title}
                      </h3>
                      <p className="text-white/90 text-lg max-w-xs">
                        {category.description}
                      </p>
                      
                      {/* Call to action */}
                      <div className="mt-6 inline-flex items-center text-white/90 text-sm font-medium group-hover:text-white transition-colors duration-300">
                        <span>Découvrir</span>
                        <svg 
                          className="ml-2 w-5 h-5 transform transition-transform duration-500 group-hover:translate-x-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M17 8l4 4m0 0l-4 4m4-4H3" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
