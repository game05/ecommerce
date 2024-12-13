import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Emoji et Titre */}
        <div className="space-y-4">
          <div className="text-8xl animate-bounce">👶</div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary">Oups !</h1>
          <h2 className="text-2xl md:text-3xl text-gray-600">
            Page introuvable
          </h2>
        </div>

        {/* Message */}
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          Il semble que notre petit bout de chou se soit égaré... 
          Cette page n&apos;existe pas ou a été déplacée.
        </p>

        {/* Boutons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition"
          >
            Retour à l&apos;accueil
          </Link>
          
          <div className="flex justify-center space-x-4 mt-4">
            <Link
              href="/products"
              className="text-gray-500 hover:text-primary transition"
            >
              Voir nos produits
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/contact"
              className="text-gray-500 hover:text-primary transition"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
