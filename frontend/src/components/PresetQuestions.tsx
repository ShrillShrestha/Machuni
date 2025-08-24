import React, { useEffect, useState } from "react";
import { PresetRequest, PresetResponse, UserPreferences } from "../types";

interface PresetQuestionsProps {
  preferences: UserPreferences;
  onQuestionClick: (question: string) => void;
  compact?: boolean;
}

const PresetQuestions: React.FC<PresetQuestionsProps> = ({
  preferences,
  onQuestionClick,
  compact = false,
}) => {
  const [presetQuestions, setPresetQuestions] = useState([
    "What documents do I need for green card application?",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchPresetQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const requestBody: PresetRequest = {
        status: preferences.visaStatus ? preferences.visaStatus : "",
        interests: [],
        country: "United States",
        state: preferences.state ? preferences.state : "",
        language_preferance: "English",
      };

      const response = await fetch("http://127.0.0.1:5000/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PresetResponse = await response.json();
      console.log({ data });
      setPresetQuestions(data.queries);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch FAQs");
      setPresetQuestions(["How do I apply for a work permit?"]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPresetQuestions();
    console.log(presetQuestions);
  }, [preferences]);

  if (presetQuestions.length === 0) return null;

  return (
    <div
      className={`flex gap-2 overflow-x-auto ${
        compact ? "py-1" : "p-3"
      } scrollbar-hide`}
    >
      {isLoading && (
        <button
          disabled
          className="flex-shrink-0 px-3 py-1 bg-gray-100 hover:bg-blue-50 text-md sm:text-sm rounded-xl text-gray-700 hover:text-blue-600 border border-gray-200"
        >
          Loading Presets....
        </button>
      )}
      {presetQuestions.map((question, index) => (
        <button
          key={index}
          onClick={() => onQuestionClick(question)}
          className="flex-shrink-0 px-3 py-1 bg-gray-100 hover:bg-blue-50 text-md sm:text-sm rounded-xl text-gray-700 hover:text-blue-600 border border-gray-200"
        >
          {question}
        </button>
      ))}
    </div>
  );
};
export default PresetQuestions;
