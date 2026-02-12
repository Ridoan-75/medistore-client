"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MessageSquare,
  Loader2,
  CheckCircle,
  LogIn,
  Send,
  User,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { useToast } from "@/src/hooks/use-toast";
import { createReviewAction } from "@/src/actions/review.action";

interface ReviewUser {
  id: string;
  name: string;
  image?: string | null;
}

interface Review {
  id?: string;
  medicineId: string;
  rating: number;
  comment: string | null;
  user?: ReviewUser;
  createdAt?: string;
}

interface ProductReviewsProps {
  medicineId: string;
  initialReviews: Review[];
  userReview?: Review | null;
  isLoggedIn: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const formatRelativeDate = (dateString?: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getInitials = (name?: string): string => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const calculateRatingStats = (reviews: Review[]) => {
  const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      stats[r.rating as keyof typeof stats]++;
    }
  });
  return stats;
};

export function ProductReviews({
  medicineId,
  initialReviews,
  userReview,
  isLoggedIn,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(!!userReview);

  const { toast } = useToast();
  const router = useRouter();

  const displayRating = hoverRating || rating;
  const ratingStats = calculateRatingStats(reviews);
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please login to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write your review",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await createReviewAction({
      medicineId,
      rating,
      comment: comment.trim(),
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setReviews((prev) => [data, ...prev]);
      setHasReviewed(true);
      setRating(0);
      setComment("");

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      router.refresh();
    }
  };

  return (
    <div className="space-y-10">
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-3xl border-2 border-amber-200/50 dark:border-amber-800/50">
          <div className="text-center md:border-r-2 border-amber-200 dark:border-amber-800">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative text-6xl md:text-7xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                {averageRating.toFixed(1)}
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-7 w-7 transition-all duration-300 ${
                    i < Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400 scale-110"
                      : "text-slate-300 dark:text-slate-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-bold">
              Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingStats[star as keyof typeof ratingStats];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-sm font-black w-10 text-slate-700 dark:text-slate-300">{star} ★</span>
                  <div className="flex-1 h-3 bg-white dark:bg-slate-800 rounded-full overflow-hidden border-2 border-amber-200 dark:border-amber-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-bold w-10 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isLoggedIn && !hasReviewed && (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl">Write a Review</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                Share your experience with this product
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label className="text-base font-black text-slate-900 dark:text-white">Your Rating</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-all duration-300 hover:scale-125 focus:outline-none focus:scale-125"
                    >
                      <Star
                        className={`h-10 w-10 md:h-12 md:w-12 transition-all duration-300 ${
                          star <= displayRating
                            ? "fill-amber-400 text-amber-400 scale-110"
                            : "text-slate-300 dark:text-slate-700 hover:text-amber-300 dark:hover:text-amber-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {displayRating > 0 && (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/30">
                    <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-base font-black text-amber-700 dark:text-amber-300">
                      {RATING_LABELS[displayRating]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="comment" className="text-base font-black text-slate-900 dark:text-white">Your Review</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this product? How was your experience?"
                rows={6}
                className="resize-none border-2 rounded-2xl text-base"
              />
              <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                {comment.length}/500 characters
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-2xl shadow-amber-500/30 font-black text-base h-14 px-10 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting Review...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {isLoggedIn && hasReviewed && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 flex items-center gap-6 shadow-xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl mb-1">
              Thank you for your review!
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
              Your feedback helps other customers make informed decisions.
            </p>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center shadow-xl">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-indigo-500/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
              <LogIn className="h-10 w-10 text-white" />
            </div>
          </div>
          <h3 className="font-black text-slate-900 dark:text-white text-2xl mb-3">
            Login to Write a Review
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium max-w-md mx-auto">
            Share your experience and help others make better decisions.
          </p>
          <Button asChild className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-2xl shadow-sky-500/30 font-black h-14 px-10 rounded-2xl">
            <Link href="/login">
              <LogIn className="h-5 w-5 mr-2" />
              Login Now
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Award className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Customer Reviews
            <span className="ml-3 text-lg font-semibold text-slate-600 dark:text-slate-400">
              ({reviews.length})
            </span>
          </h3>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-400/30 to-slate-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center shadow-xl">
                <MessageSquare className="h-10 w-10 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <h4 className="font-black text-slate-900 dark:text-white text-xl mb-2">No Reviews Yet</h4>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={review.id || index}
                className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 hover:shadow-2xl hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start gap-6">
                  <div className="shrink-0">
                    {review.user?.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-200 dark:ring-slate-800 shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-2xl flex items-center justify-center ring-4 ring-slate-200 dark:ring-slate-800 shadow-lg">
                        <span className="font-black text-white text-xl">
                          {getInitials(review.user?.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-black text-slate-900 dark:text-white text-lg">
                          {review.user?.name || "Anonymous"}
                        </h4>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                        {formatRelativeDate(review.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-black text-amber-700 dark:text-amber-400 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 rounded-full">
                        {RATING_LABELS[review.rating]}
                      </span>
                    </div>

                    {review.comment && (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}