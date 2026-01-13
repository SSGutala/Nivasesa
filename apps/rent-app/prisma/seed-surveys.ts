import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding surveys...");

  // Video Call Survey
  const videoCallSurvey = await prisma.survey.upsert({
    where: { id: "video-call-survey" },
    update: {},
    create: {
      id: "video-call-survey",
      title: "Video Call Feedback",
      description:
        "Help us improve your video call experience. Your feedback is valuable!",
      type: "video_call",
      isActive: true,
      questions: JSON.stringify([
        {
          id: "q1",
          type: "rating",
          question: "How was the video quality?",
          required: true,
          min: 1,
          max: 5,
        },
        {
          id: "q2",
          type: "rating",
          question: "How was the audio quality?",
          required: true,
          min: 1,
          max: 5,
        },
        {
          id: "q3",
          type: "yes_no",
          question: "Did the video call help you make a decision?",
          required: true,
        },
        {
          id: "q4",
          type: "multiple_choice",
          question: "What was the main purpose of this call?",
          required: true,
          options: [
            "View the property",
            "Meet potential roommate",
            "Discuss terms",
            "General inquiry",
            "Other",
          ],
        },
        {
          id: "q5",
          type: "text",
          question: "Any suggestions to improve our video call feature?",
          required: false,
        },
      ]),
    },
  });

  // Booking Completion Survey
  const bookingSurvey = await prisma.survey.upsert({
    where: { id: "booking-survey" },
    update: {},
    create: {
      id: "booking-survey",
      title: "Booking Experience Feedback",
      description:
        "Thank you for completing your booking. Please share your experience!",
      type: "booking",
      isActive: true,
      questions: JSON.stringify([
        {
          id: "q1",
          type: "rating",
          question: "How was your overall experience with the host/guest?",
          required: true,
          min: 1,
          max: 5,
        },
        {
          id: "q2",
          type: "yes_no",
          question: "Was the listing accurate to the description?",
          required: true,
        },
        {
          id: "q3",
          type: "yes_no",
          question: "Would you recommend this host/guest to others?",
          required: true,
        },
        {
          id: "q4",
          type: "multiple_choice",
          question: "How did you find the check-in process?",
          required: true,
          options: [
            "Very easy",
            "Easy",
            "Neutral",
            "Difficult",
            "Very difficult",
          ],
        },
        {
          id: "q5",
          type: "multiple_choice",
          question: "What did you appreciate most?",
          required: false,
          options: [
            "Communication",
            "Cleanliness",
            "Location",
            "Amenities",
            "Cultural fit",
            "Flexibility",
          ],
        },
        {
          id: "q6",
          type: "text",
          question: "What could be improved?",
          required: false,
        },
      ]),
    },
  });

  // General Platform Survey
  const generalSurvey = await prisma.survey.upsert({
    where: { id: "general-survey" },
    update: {},
    create: {
      id: "general-survey",
      title: "Platform Experience Survey",
      description:
        "Help us improve Nivasesa by sharing your experience with the platform.",
      type: "general",
      isActive: true,
      questions: JSON.stringify([
        {
          id: "q1",
          type: "rating",
          question: "How easy is it to use Nivasesa?",
          required: true,
          min: 1,
          max: 5,
        },
        {
          id: "q2",
          type: "yes_no",
          question: "Have you found suitable listings/roommates?",
          required: true,
        },
        {
          id: "q3",
          type: "multiple_choice",
          question: "What feature do you use most?",
          required: true,
          options: [
            "Browse listings",
            "Find roommates",
            "Groups",
            "Video calls",
            "Messaging",
            "Freedom Score",
          ],
        },
        {
          id: "q4",
          type: "multiple_choice",
          question: "What would you like to see improved?",
          required: false,
          options: [
            "Search filters",
            "Matching algorithm",
            "User profiles",
            "Communication tools",
            "Mobile experience",
            "Other",
          ],
        },
        {
          id: "q5",
          type: "text",
          question:
            "What's the one thing that would make Nivasesa better for you?",
          required: false,
        },
      ]),
    },
  });

  console.log("Created surveys:", {
    videoCallSurvey: videoCallSurvey.id,
    bookingSurvey: bookingSurvey.id,
    generalSurvey: generalSurvey.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
