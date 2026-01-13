"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/ui/StarRating";
import {
  Survey,
  SurveyQuestion,
  SurveyAnswer,
  submitSurveyResponseAction,
} from "@/actions/surveys";
import styles from "./SurveyForm.module.css";

interface SurveyFormProps {
  survey: Survey;
  interactionId?: string;
  interactionType?: string;
}

export default function SurveyForm({
  survey,
  interactionId,
  interactionType,
}: SurveyFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateForm = (): boolean => {
    // Check all required questions are answered
    const requiredQuestions = survey.questions.filter((q) => q.required);
    for (const question of requiredQuestions) {
      if (!answers[question.id]) {
        setError(`Please answer: ${question.question}`);
        return false;
      }
    }

    // Require overall rating
    if (rating === 0) {
      setError("Please provide an overall rating");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get userId from session (placeholder - would need real auth)
      const userId = "temp-user-id"; // TODO: Replace with actual session userId
      const userRole = "renter"; // TODO: Auto-infer from interaction

      const surveyAnswers: SurveyAnswer[] = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      const result = await submitSurveyResponseAction(
        survey.id,
        userId,
        userRole,
        surveyAnswers,
        interactionId,
        interactionType,
        rating,
        feedback
      );

      if (result.success) {
        router.push("/dashboard?surveySubmitted=true");
      } else {
        setError(result.error || "Failed to submit survey");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: SurveyQuestion) => {
    switch (question.type) {
      case "rating":
        return (
          <StarRating
            value={
              typeof answers[question.id] === "number"
                ? (answers[question.id] as number)
                : 0
            }
            onChange={(value) => handleAnswerChange(question.id, value)}
            max={question.max || 5}
            size="lg"
          />
        );

      case "yes_no":
        return (
          <div className={styles.radioGroup}>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name={question.id}
                value="yes"
                checked={answers[question.id] === "yes"}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
              />
              <span>Yes</span>
            </label>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name={question.id}
                value="no"
                checked={answers[question.id] === "no"}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
              />
              <span>No</span>
            </label>
          </div>
        );

      case "multiple_choice":
        return (
          <div className={styles.radioGroup}>
            {question.options?.map((option) => (
              <label key={option} className={styles.radioOption}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "text":
        return (
          <textarea
            className={styles.textarea}
            value={(answers[question.id] as string) || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            rows={4}
            placeholder="Share your thoughts..."
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{survey.title}</h1>
        {survey.description && (
          <p className={styles.description}>{survey.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Overall Rating */}
        <div className={styles.ratingSection}>
          <label className={styles.label}>
            Overall Rating
            <span className={styles.required}>*</span>
          </label>
          <div className={styles.ratingContainer}>
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <span className={styles.ratingText}>
                {rating} out of 5 stars
              </span>
            )}
          </div>
        </div>

        {/* Survey Questions */}
        {survey.questions.map((question, index) => (
          <div key={question.id} className={styles.questionContainer}>
            <label className={styles.label}>
              {index + 1}. {question.question}
              {question.required && (
                <span className={styles.required}>*</span>
              )}
            </label>
            {renderQuestion(question)}
          </div>
        ))}

        {/* Additional Feedback */}
        <div className={styles.questionContainer}>
          <label className={styles.label} htmlFor="feedback">
            Additional Comments (Optional)
          </label>
          <textarea
            id="feedback"
            className={styles.textarea}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
            placeholder="Share any additional thoughts or suggestions..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </button>
        </div>
      </form>
    </div>
  );
}
