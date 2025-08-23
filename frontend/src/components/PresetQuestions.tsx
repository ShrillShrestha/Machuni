import React from "react";
import { Sparkles } from "lucide-react";
import { PresetQuestion, UserPreferences } from "../types";

interface PresetQuestionsProps {
  preferences: UserPreferences;
  onQuestionClick: (question: PresetQuestion) => void;
  compact?: boolean;
}

const allPresetQuestions: PresetQuestion[] = [
  {
    id: "1",
    text: "How do I apply for a work permit?",
    category: "Work Authorization",
    visaStatuses: ["Student Visa", "Asylum Seeker", "Refugee Status"],
  },
  {
    id: "2",
    text: "What documents do I need for green card application?",
    category: "Permanent Residence",
    visaStatuses: ["Work Visa", "Student Visa", "Asylum Seeker"],
  },
  {
    id: "3",
    text: "How long does the citizenship process take?",
    category: "Citizenship",
    visaStatuses: ["Permanent Resident"],
  },
  {
    id: "4",
    text: "Can I travel outside the country with my current status?",
    category: "Travel",
    visaStatuses: [
      "Student Visa",
      "Work Visa",
      "Asylum Seeker",
      "Permanent Resident",
    ],
  },
  {
    id: "5",
    text: "How do I extend my visa?",
    category: "Visa Extension",
    visaStatuses: ["Student Visa", "Work Visa", "Tourist Visa"],
  },
  {
    id: "6",
    text: "What are my rights as a refugee?",
    category: "Rights",
    visaStatuses: ["Refugee Status", "Asylum Seeker"],
  },
  {
    id: "7",
    text: "How do I change my visa status?",
    category: "Status Change",
    visaStatuses: ["Student Visa", "Tourist Visa", "Work Visa"],
  },
  {
    id: "8",
    text: "What healthcare benefits am I eligible for?",
    category: "Benefits",
    visaStatuses: ["Permanent Resident", "Refugee Status", "Asylum Seeker"],
  },
];

const PresetQuestions: React.FC<PresetQuestionsProps> = ({
  preferences,
  onQuestionClick,
  compact = false,
}) => {
  const relevantQuestions = allPresetQuestions.slice(0, 3);

  if (relevantQuestions.length === 0) return null;

  return (
    <div
      className={`flex gap-2 overflow-x-auto ${
        compact ? "py-1" : "p-3"
      } scrollbar-hide`}
    >
      {relevantQuestions.map((question) => (
        <button
          key={question.id}
          onClick={() => onQuestionClick(question)}
          className="flex-shrink-0 px-3 py-1 bg-gray-100 hover:bg-blue-50 text-md sm:text-sm rounded-xl text-gray-700 hover:text-blue-600 border border-gray-200"
        >
          {question.text}
        </button>
      ))}
    </div>
  );
};
export default PresetQuestions;
