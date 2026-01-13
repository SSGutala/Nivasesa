"use client";

import { StarRating } from "./StarRating";
import styles from "./ReviewCard.module.css";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment?: string | null;
    type: string;
    createdAt: string | Date;
    reviewerId: string;
    revieweeId: string;
  };
  reviewerName?: string;
  showType?: boolean;
}

export function ReviewCard({
  review,
  reviewerName = "Anonymous",
  showType = true,
}: ReviewCardProps) {
  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReviewTypeLabel = (type: string) => {
    switch (type) {
      case "host_to_renter":
        return "Host Review";
      case "renter_to_host":
        return "Renter Review";
      default:
        return "Review";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getBadgeClass = (type: string) => {
    if (type === "host_to_renter") return styles.host;
    if (type === "renter_to_host") return styles.renter;
    return "";
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.reviewerInfo}>
          <div className={styles.avatar}>{getInitials(reviewerName)}</div>
          <div className={styles.reviewerDetails}>
            <div className={styles.reviewerName}>
              {reviewerName}
              {showType && (
                <span className={`${styles.badge} ${getBadgeClass(review.type)}`}>
                  {getReviewTypeLabel(review.type)}
                </span>
              )}
            </div>
            <div className={styles.reviewType}>{formatDate(review.createdAt)}</div>
          </div>
        </div>
      </div>

      <div className={styles.ratingSection}>
        <StarRating value={review.rating} onChange={() => {}} readonly />
        <span className={styles.ratingValue}>{review.rating}.0</span>
      </div>

      {review.comment ? (
        <p className={styles.comment}>{review.comment}</p>
      ) : (
        <p className={styles.noComment}>No written review provided</p>
      )}
    </div>
  );
}
