'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Types pour les étapes
type Step = {
  id: number;
  title: string;
  description: string;
};

// Définition des étapes de personnalisation
const steps: Step[] = [
  {
    id: 1,
    title: "Choix du motif",
    description: "Sélectionnez le motif que vous souhaitez broder"
  },
  {
    id: 2,
    title: "Personnalisation du texte",
    description: "Ajoutez le texte de votre choix (nom, date, message...)"
  },
  {
    id: 3,
    title: "Choix des couleurs",
    description: "Sélectionnez les couleurs pour votre broderie"
  },
  {
    id: 4,
    title: "Aperçu final",
    description: "Vérifiez votre création avant de valider"
  }
];

export default function PersonnalisationPage({ params }: { params: { slug: string } }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    motif: '',
    texte: '',
    couleurs: [],
  });

  // Fonction pour aller à l'étape suivante
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec les étapes */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Personnalisation de votre produit
            </h1>
          </div>
          
          {/* Barre de progression */}
          <div className="mt-8 relative">
            <div className="flex justify-between items-center">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center relative z-10 ${
                    step.id === currentStep
                      ? 'text-pink-600'
                      : step.id < currentStep
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${
                      step.id === currentStep
                        ? 'border-pink-600 bg-pink-50'
                        : step.id < currentStep
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-xs mt-2 font-medium">{step.title}</div>
                </div>
              ))}
            </div>
            
            {/* Ligne de progression */}
            <div className="absolute top-4 left-0 w-full">
              <div className="h-0.5 bg-gray-200">
                <div
                  className="h-0.5 bg-pink-600 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Description de l'étape actuelle */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="mt-2 text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {/* Contenu de l'étape */}
          <div className="min-h-[400px]">
            {/* Le contenu spécifique à chaque étape sera ajouté ici */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Motifs à ajouter */}
                <div className="text-center p-4">
                  <p>Contenu de l'étape 1 à venir...</p>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                {/* Formulaire de texte à ajouter */}
                <p>Contenu de l'étape 2 à venir...</p>
              </div>
            )}
            {currentStep === 3 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Sélecteur de couleurs à ajouter */}
                <p>Contenu de l'étape 3 à venir...</p>
              </div>
            )}
            {currentStep === 4 && (
              <div className="flex flex-col items-center">
                {/* Aperçu final à ajouter */}
                <p>Contenu de l'étape 4 à venir...</p>
              </div>
            )}
          </div>

          {/* Boutons de navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300
                ${currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-pink-600'
                }`}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </button>
            
            <button
              onClick={nextStep}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300
                ${currentStep === steps.length
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
            >
              {currentStep === steps.length ? (
                'Valider la personnalisation'
              ) : (
                <>
                  Suivant
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
