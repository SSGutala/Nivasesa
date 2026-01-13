import { Metadata } from "next";
import { getAllSurveysAction } from "@/actions/surveys";
import SurveyList from "./SurveyList";

export const metadata: Metadata = {
  title: "Manage Surveys - Admin - Nivasesa",
  description: "Manage post-interaction surveys",
};

export default async function AdminSurveysPage() {
  const surveys = await getAllSurveysAction();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Survey Management</h1>
        <p className="mt-2 text-gray-600">
          Manage post-interaction surveys for video calls, bookings, and
          general feedback.
        </p>
      </div>

      <SurveyList surveys={surveys} />
    </div>
  );
}
