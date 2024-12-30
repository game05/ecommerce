'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  verified_purchase: boolean;
  likes_count: number;
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
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    userName: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('avis')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Récupérer la moyenne et le total
      const { data: reviewsForStats } = await supabase
        .from('avis')
        .select('rating')
        .eq('product_id', productId);

      if (reviewsForStats && reviewsForStats.length > 0) {
        const totalReviews = reviewsForStats.length;
        const sum = reviewsForStats.reduce((acc, review) => acc + review.rating, 0);
        const average = Math.round((sum / totalReviews) * 10) / 10;

        setAverageRating(average);
        setTotalReviews(totalReviews);
      } else {
        setAverageRating(0);
        setTotalReviews(0);
      }

      setReviews(reviewsData || []);
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
        comment: newReview.comment,
        verified_purchase: true
      });

      if (error) throw error;

      setShowReviewForm(false);
      setNewReview({
        rating: 5,
        comment: '',
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
    <div className="mt-8">
      {/* En-tête des avis */}
      <div id="reviews" className="scroll-mt-16">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Avis clients
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= averageRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-900">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({totalReviews} avis)</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(true)}
              className="mt-4 md:mt-0 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              Donner mon avis
            </button>
          </div>

          {/* Liste des avis style carte */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-pink-50/50 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
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
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.user_name}</span>
                    {review.verified_purchase && (
                      <span className="text-xs text-green-600 font-medium">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal du formulaire d'avis */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Donnez votre avis</h3>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre prénom
                </label>
                <input
                  type="text"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= newReview.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre commentaire
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-2 border border-gray-200 rounded-full hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
