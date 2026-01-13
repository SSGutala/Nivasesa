"use client";

import { Star } from "lucide-react";
import styles from "./StarRating.module.css";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

export function StarRating({
  value,
  onChange,
  max = 5,
  size = "md",
  readonly = false,
}: StarRatingProps) {
  const handleClick = (rating: number) => {
    if (!readonly) {
      onChange(rating);
    }
  };

  const sizeClass = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  }[size];

  return (
    <div className={`${styles.container} ${sizeClass}`}>
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          disabled={readonly}
          className={`${styles.star} ${rating <= value ? styles.filled : ""} ${
            readonly ? styles.readonly : ""
          }`}
          aria-label={`Rate ${rating} out of ${max}`}
        >
          <Star />
        </button>
      ))}
    </div>
  );
}
