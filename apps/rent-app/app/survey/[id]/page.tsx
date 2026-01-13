import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSurveyByIdAction } from "@/actions/surveys";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "Survey - Nivasesa",
  description: "Share your experience to help us improve",
};

interface SurveyPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    interactionId?: string;
    interactionType?: string;
  }>;
}

export default async function SurveyPage({
  params,
  searchParams,
}: SurveyPageProps) {
  const { id } = await params;
  const { interactionId, interactionType } = await searchParams;

  // Fetch survey
  const survey = await getSurveyByIdAction(id);

  if (!survey || !survey.isActive) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <SurveyForm
          survey={survey}
          interactionId={interactionId}
          interactionType={interactionType}
        />
      </div>
    </div>
  );
}
