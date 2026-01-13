"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { Button } from "./Button";
import styles from "./ReviewList.module.css";

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  type: string;
  createdAt: string | Date;
  reviewerId: string;
  revieweeId: string;
}

interface ReviewListProps {
  reviews: Review[];
  averageRating?: number;
  totalReviews?: number;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  title?: string;
  showType?: boolean;
  initialDisplayCount?: number;
}

export function ReviewList({
  reviews,
  averageRating,
  totalReviews,
  ratingBreakdown,
  title = "Reviews",
  showType = true,
  initialDisplayCount = 5,
}: ReviewListProps) {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);

  const hasMore = reviews.length > displayCount;
  const displayedReviews = reviews.slice(0, displayCount);

  const loadMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  const renderRatingBar = (rating: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div key={rating} className={styles.breakdownRow}>
        <div className={styles.breakdownLabel}>
          <Star size={14} fill="currentColor" />
          {rating}
        </div>
        <div className={styles.breakdownBar}>
          <div
            className={styles.breakdownFill}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className={styles.breakdownCount}>{count}</div>
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Star size={48} />
          </div>
          <p>No reviews yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {averageRating !== undefined && totalReviews !== undefined && ratingBreakdown && (
        <div className={styles.summary}>
          <div className={styles.averageRating}>
            <div className={styles.averageValue}>
              {averageRating.toFixed(1)}
            </div>
            <div className={styles.averageLabel}>
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </div>
          </div>
          <div className={styles.breakdown}>
            {[5, 4, 3, 2, 1].map((rating) =>
              renderRatingBar(
                rating,
                ratingBreakdown[rating as keyof typeof ratingBreakdown],
                totalReviews
              )
            )}
          </div>
        </div>
      )}

      <div className={styles.reviews}>
        {displayedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showType={showType}
          />
        ))}
      </div>

      {hasMore && (
        <Button
          onClick={loadMore}
          variant="outline"
          className={styles.loadMore}
        >
          Load More Reviews
        </Button>
      )}
    </div>
  );
}
