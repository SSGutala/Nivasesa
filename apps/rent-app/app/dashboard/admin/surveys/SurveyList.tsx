"use client";

import { useState } from "react";
import { Survey, toggleSurveyActiveAction } from "@/actions/surveys";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import styles from "./SurveyList.module.css";

interface SurveyListProps {
  surveys: Survey[];
}

export default function SurveyList({ surveys: initialSurveys }: SurveyListProps) {
  const [surveys, setSurveys] = useState(initialSurveys);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleToggleActive = async (surveyId: string) => {
    const result = await toggleSurveyActiveAction(surveyId);
    if (result.success) {
      setSurveys((prev) =>
        prev.map((s) =>
          s.id === surveyId ? { ...s, isActive: !s.isActive } : s
        )
      );
    }
  };

  const getSurveyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      video_call: "Video Call",
      booking: "Booking",
      general: "General",
    };
    return labels[type] || type;
  };

  const getSurveyTypeBadgeClass = (type: string) => {
    const classes: Record<string, string> = {
      video_call: styles.badgeBlue,
      booking: styles.badgeGreen,
      general: styles.badgePurple,
    };
    return classes[type] || styles.badgeGray;
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {surveys.map((survey) => (
          <div key={survey.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.titleRow}>
                <h3 className={styles.title}>{survey.title}</h3>
                <span
                  className={`${styles.badge} ${getSurveyTypeBadgeClass(survey.type)}`}
                >
                  {getSurveyTypeLabel(survey.type)}
                </span>
              </div>
              {survey.description && (
                <p className={styles.description}>{survey.description}</p>
              )}
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Questions</span>
                <span className={styles.statValue}>{survey.questions.length}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Created</span>
                <span className={styles.statValue}>
                  {new Date(survey.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => setSelectedSurvey(survey)}
                className={styles.viewButton}
              >
                <Eye size={16} />
                View Questions
              </button>
              <button
                onClick={() => handleToggleActive(survey.id)}
                className={`${styles.toggleButton} ${
                  survey.isActive ? styles.active : styles.inactive
                }`}
              >
                {survey.isActive ? (
                  <>
                    <CheckCircle size={16} />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    Inactive
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Survey Details Modal */}
      {selectedSurvey && (
        <div className={styles.modal} onClick={() => setSelectedSurvey(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedSurvey.title}</h2>
              <button
                onClick={() => setSelectedSurvey(null)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {selectedSurvey.questions.map((q, idx) => (
                <div key={q.id} className={styles.question}>
                  <div className={styles.questionHeader}>
                    <span className={styles.questionNumber}>{idx + 1}.</span>
                    <span className={styles.questionText}>{q.question}</span>
                    {q.required && (
                      <span className={styles.required}>Required</span>
                    )}
                  </div>
                  <div className={styles.questionMeta}>
                    <span className={styles.questionType}>
                      Type: {q.type.replace("_", " ")}
                    </span>
                    {q.options && (
                      <div className={styles.options}>
                        Options: {q.options.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
