import React, { useState } from "react";

interface Question {
  id: string;
  text: string;
  author: string;
  answers: { id: string; text: string; author: string }[];
}

const CommunityQnATab: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "What are the best resources for finding internships in the US?",
      author: "Student123",
      answers: [
        {
          id: "1-1",
          text: "You can check websites like LinkedIn, Glassdoor, and Indeed. Also, your university's career center might have exclusive opportunities.",
          author: "Ram Kaji",
        },
      ],
    },
    {
      id: "2",
      text: "How do I apply for OPT as an international student?",
      author: "IntlStudent",
      answers: [
        {
          id: "2-1",
          text: "You need to contact your university's international office. They will guide you through the process, including filling out Form I-765.",
          author: "Hari Mishra",
        },
      ],
    },
    {
      id: "3",
      text: "What are the best ways to improve my English speaking skills?",
      author: "OM",
      answers: [
        {
          id: "3-1",
          text: "Join English conversation clubs, watch movies with subtitles, and practice speaking with friends or language partners.",
          author: "Prakash",
        },
      ],
    },
  ]);
  const [newQuestion, setNewQuestion] = useState("");

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const question: Question = {
      id: Date.now().toString(),
      text: newQuestion.trim(),
      author: Math.random() > 0.5 ? "Hari" : "Ram",
      answers: [],
    };
    setQuestions((prev) => [question, ...prev]);
    setNewQuestion("");
  };

  const randomNames = ["OM", "Prakash", "Pandey", "Ramu", "Kumar"];

  const handleAddAnswer = (questionId: string, answerText: string) => {
    const randomAuthor = randomNames[Math.floor(Math.random() * randomNames.length)];
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [
                ...q.answers,
                { id: Date.now().toString(), text: answerText, author: randomAuthor },
              ],
            }
          : q
      )
    );
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Community Q&amp;A</h1>

      {/* Ask a Question */}
      <div className="space-y-3">
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question to the community..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Post Question
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold">{question.text}</h2>
            <p className="text-sm text-gray-500">Asked by {question.author}</p>

            {/* Answers */}
            <div className="mt-4 space-y-3">
              {question.answers.map((answer) => (
                <div key={answer.id} className="p-3 border border-gray-300 rounded-lg">
                  <p>{answer.text}</p>
                  <p className="text-sm text-gray-500">Answered by {answer.author}</p>
                </div>
              ))}
            </div>

            {/* Add an Answer */}
            <div className="mt-4">
              <textarea
                placeholder="Write an answer..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddAnswer(question.id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              ></textarea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityQnATab;
