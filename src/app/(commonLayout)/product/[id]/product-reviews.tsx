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
    <div className="space-y-8">
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/50 rounded-xl border border-border">
          <div className="text-center md:border-r border-border">
            <div className="text-5xl font-bold text-foreground mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingStats[star as keyof typeof ratingStats];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{star} ★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isLoggedIn && !hasReviewed && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Write a Review</h3>
              <p className="text-sm text-muted-foreground">
                Share your experience with this product
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Your Rating</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= displayRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40 hover:text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {displayRating > 0 && (
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400 px-3 py-1 bg-amber-500/10 rounded-full">
                    {RATING_LABELS[displayRating]}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this product? How was your experience?"
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {comment.length}/500 characters
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {isLoggedIn && hasReviewed && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Thank you for your review!
            </h3>
            <p className="text-sm text-muted-foreground">
              Your feedback helps other customers make informed decisions.
            </p>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className="bg-card border-2 border-dashed border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Login to Write a Review
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Share your experience and help others make better decisions.
          </p>
          <Button asChild variant="outline" className="border-2">
            <Link href="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Login Now
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">
            Customer Reviews
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({reviews.length})
            </span>
          </h3>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">No Reviews Yet</h4>
            <p className="text-muted-foreground text-sm">
              Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={review.id || index}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {review.user?.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center ring-2 ring-border">
                        <span className="font-bold text-primary">
                          {getInitials(review.user?.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">
                          {review.user?.name || "Anonymous"}
                        </h4>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeDate(review.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {RATING_LABELS[review.rating]}
                      </span>
                    </div>

                    {review.comment && (
                      <p className="text-muted-foreground leading-relaxed">
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