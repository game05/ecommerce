'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  verified_purchase: boolean;
  likes_count: number;
  pros: string[];
  cons: string[];
}

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');

  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    pros: [''],
    cons: [''],
    userName: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, filterRating, sortBy]);

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from('avis')
        .select('*')
        .eq('product_id', productId);

      if (filterRating) {
        query = query.eq('rating', filterRating);
      }

      if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('likes_count', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      setReviews(data || []);

      // Récupérer la moyenne et le total
      const { data: stats } = await supabase.rpc('get_product_rating', {
        product_id_param: productId
      });

      if (stats && stats[0]) {
        setAverageRating(stats[0].average_rating);
        setTotalReviews(stats[0].total_reviews);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('avis').insert({
        product_id: productId,
        user_name: newReview.userName,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        pros: newReview.pros.filter(p => p.trim() !== ''),
        cons: newReview.cons.filter(c => c.trim() !== ''),
        verified_purchase: true // À gérer avec la vérification des commandes
      });

      if (error) throw error;

      setShowReviewForm(false);
      setNewReview({
        rating: 5,
        title: '',
        comment: '',
        pros: [''],
        cons: [''],
        userName: ''
      });
      fetchReviews();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avis:', error);
    }
  };

  const handleLikeReview = async (reviewId: string) => {
    try {
      const { data: review } = await supabase
        .from('avis')
        .select('likes_count')
        .eq('id', reviewId)
        .single();

      if (review) {
        await supabase
          .from('avis')
          .update({ likes_count: review.likes_count + 1 })
          .eq('id', reviewId);

        fetchReviews();
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  return (
    <div className="mt-16">
      {/* En-tête des avis */}
      <div id="reviews" className="scroll-mt-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-blue-50/50 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Avis de nos clients
              </h2>
              <p className="mt-2 text-gray-600">Découvrez ce que pensent nos clients de leurs achats</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Note moyenne */}
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-6xl font-bold mb-2">{averageRating}</div>
                <div className="flex items-center justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 ${
                        star <= averageRating
                          ? 'text-yellow-300 fill-yellow-300'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg font-medium">
                  Sur {totalReviews} avis
                </p>
              </div>

              {/* Distribution des notes */}
              <div className="bg-white p-6 rounded-2xl shadow-lg space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = (count / totalReviews) * 100 || 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="font-medium">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bouton Ajouter un avis */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Donner mon avis
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mt-12 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-purple-500" />
              <select
                value={filterRating || ''}
                onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                className="bg-gray-50 border-2 border-gray-100 rounded-xl py-2 px-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Toutes les notes</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} étoiles
                  </option>
                ))}
              </select>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful')}
              className="bg-gray-50 border-2 border-gray-100 rounded-xl py-2 px-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="recent">Plus récents</option>
              <option value="helpful">Plus utiles</option>
            </select>
          </div>
        </div>

        {/* Liste des avis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {review.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-pink-600 transition-colors">
                      {review.user_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {review.verified_purchase && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
                        fill="currentColor"
                      />
                    </svg>
                    Achat vérifié
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-lg text-gray-900">{review.title}</h4>
                <p className="mt-2 text-gray-600 leading-relaxed">{review.comment}</p>

                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <div className="mt-6 space-y-4">
                    {review.pros.length > 0 && (
                      <div className="bg-green-50/50 backdrop-blur-sm rounded-xl p-4 border border-green-100">
                        <h5 className="text-green-800 font-medium flex items-center gap-2">
                          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Points positifs
                        </h5>
                        <ul className="mt-2 space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index} className="text-green-700 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons.length > 0 && (
                      <div className="bg-red-50/50 backdrop-blur-sm rounded-xl p-4 border border-red-100">
                        <h5 className="text-red-800 font-medium flex items-center gap-2">
                          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Points négatifs
                        </h5>
                        <ul className="mt-2 space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index} className="text-red-700 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleLikeReview(review.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors group"
                  >
                    <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{review.likes_count}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire d'ajout d'avis */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Donner mon avis</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Votre nom</label>
                <input
                  type="text"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReview.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Commentaire</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full border rounded-md p-2 h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points positifs</label>
                {newReview.pros.map((pro, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => {
                        const newPros = [...newReview.pros];
                        newPros[index] = e.target.value;
                        setNewReview({ ...newReview, pros: newPros });
                      }}
                      className="flex-1 border rounded-md p-2"
                      placeholder="Point positif"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPros = [...newReview.pros];
                        if (newPros.length > 1) newPros.splice(index, 1);
                        setNewReview({ ...newReview, pros: newPros });
                      }}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewReview({ ...newReview, pros: [...newReview.pros, ''] })}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  + Ajouter un point positif
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points négatifs</label>
                {newReview.cons.map((con, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => {
                        const newCons = [...newReview.cons];
                        newCons[index] = e.target.value;
                        setNewReview({ ...newReview, cons: newCons });
                      }}
                      className="flex-1 border rounded-md p-2"
                      placeholder="Point négatif"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newCons = [...newReview.cons];
                        if (newCons.length > 1) newCons.splice(index, 1);
                        setNewReview({ ...newReview, cons: newCons });
                      }}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewReview({ ...newReview, cons: [...newReview.cons, ''] })}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  + Ajouter un point négatif
                </button>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Publier mon avis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
