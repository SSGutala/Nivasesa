"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { StarRating } from "./StarRating";
import { Button } from "./Button";
import styles from "./ReviewForm.module.css";

interface ReviewFormProps {
  bookingId: string;
  reviewType: "host_to_renter" | "renter_to_host";
  onSubmit: (data: { rating: number; comment?: string }) => Promise<void>;
  onCancel?: () => void;
}

export function ReviewForm({
  bookingId,
  reviewType,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const maxCommentLength = 1000;

  const getReviewTitle = () => {
    if (reviewType === "host_to_renter") {
      return "Review Your Guest";
    }
    return "Review Your Host";
  };

  const getReviewSubtitle = () => {
    if (reviewType === "host_to_renter") {
      return "Share your experience with this guest to help other hosts.";
    }
    return "Share your experience with this host to help other renters.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.length > maxCommentLength) {
      setError(`Comment must be less than ${maxCommentLength} characters`);
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        rating,
        comment: comment.trim() || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          Review submitted successfully! Thank you for your feedback.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h3 className={styles.title}>{getReviewTitle()}</h3>
      <p className={styles.subtitle}>{getReviewSubtitle()}</p>

      <div className={styles.infoBox}>
        <Info size={16} className={styles.infoIcon} />
        <div>
          Your review will be visible to other users and cannot be edited once submitted.
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.ratingSection}>
        <label className={styles.label}>
          Rating <span className={styles.required}>*</span>
        </label>
        <div className={styles.ratingInput}>
          <StarRating
            value={rating}
            onChange={setRating}
            size="lg"
          />
          {rating > 0 && (
            <span className={styles.ratingValue}>
              {rating} {rating === 1 ? "star" : "stars"}
            </span>
          )}
        </div>
      </div>

      <div className={styles.commentSection}>
        <label className={styles.label} htmlFor="comment">
          Written Review (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share more details about your experience..."
          className={styles.textarea}
          maxLength={maxCommentLength}
        />
        <div className={styles.charCount}>
          {comment.length} / {maxCommentLength} characters
        </div>
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || rating === 0}>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
