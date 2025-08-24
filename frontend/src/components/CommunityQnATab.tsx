import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Clock,
  User,
  Plus,
  X,
  Send,
  TrendingUp,
  Calendar,
  MessageCircle,
} from "lucide-react";

interface Question {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  answers: {
    id: string;
    text: string;
    author: string;
    timestamp: string;
    upvotes: number;
    downvotes: number;
    userVote: "up" | "down" | null;
  }[];
}

type SortOption = "popular" | "recent" | "most-answered";

const CommunityQnATab: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "What are the best resources for finding internships in the US?",
      author: "Student123",
      timestamp: "2 hours ago",
      upvotes: 15,
      downvotes: 3,
      userVote: null,
      answers: [
        {
          id: "1-1",
          text: "You can check websites like LinkedIn, Glassdoor, and Indeed. Also, your university's career center might have exclusive opportunities.",
          author: "Ram Kaji",
          timestamp: "1 hour ago",
          upvotes: 12,
          downvotes: 0,
          userVote: null,
        },
        {
          id: "1-2",
          text: "Don't forget about networking events and career fairs. They're incredibly valuable for international students.",
          author: "CareerExpert",
          timestamp: "45 minutes ago",
          upvotes: 8,
          downvotes: 1,
          userVote: null,
        },
      ],
    },
    {
      id: "2",
      text: "How do I apply for OPT as an international student?",
      author: "IntlStudent",
      timestamp: "5 hours ago",
      upvotes: 28,
      downvotes: 2,
      userVote: null,
      answers: [
        {
          id: "2-1",
          text: "You need to contact your university's international office. They will guide you through the process, including filling out Form I-765.",
          author: "Hari Mishra",
          timestamp: "3 hours ago",
          upvotes: 22,
          downvotes: 1,
          userVote: null,
        },
      ],
    },
    {
      id: "3",
      text: "What are the best ways to improve my English speaking skills?",
      author: "OM",
      timestamp: "1 day ago",
      upvotes: 35,
      downvotes: 5,
      userVote: null,
      answers: [
        {
          id: "3-1",
          text: "Join English conversation clubs, watch movies with subtitles, and practice speaking with friends or language partners.",
          author: "Prakash",
          timestamp: "18 hours ago",
          upvotes: 28,
          downvotes: 2,
          userVote: null,
        },
        {
          id: "3-2",
          text: "I recommend using apps like HelloTalk or Tandem to find conversation partners from around the world.",
          author: "LanguageLover",
          timestamp: "12 hours ago",
          upvotes: 15,
          downvotes: 0,
          userVote: null,
        },
      ],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({});
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const sortedQuestions = useMemo(() => {
    const sorted = [...questions].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          const aScore = a.upvotes - a.downvotes;
          const bScore = b.upvotes - b.downvotes;
          return bScore - aScore;
        case "recent":
          // Simple timestamp comparison (in real app, use proper date parsing)
          if (a.timestamp.includes("hour") && b.timestamp.includes("day"))
            return -1;
          if (a.timestamp.includes("day") && b.timestamp.includes("hour"))
            return 1;
          return 0;
        case "most-answered":
          return b.answers.length - a.answers.length;
        default:
          return 0;
      }
    });
    return sorted;
  }, [questions, sortBy]);

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const question: Question = {
      id: Date.now().toString(),
      text: newQuestion.trim(),
      author: Math.random() > 0.5 ? "Hari" : "Ram",
      timestamp: "Just now",
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      answers: [],
    };
    setQuestions((prev) => [question, ...prev]);
    setNewQuestion("");
    setShowModal(false);
  };

  const randomNames = ["OM", "Prakash", "Pandey", "Ramu", "Kumar"];

  const handleAddAnswer = (questionId: string) => {
    const answerText = newAnswers[questionId];
    if (!answerText?.trim()) return;

    const randomAuthor =
      randomNames[Math.floor(Math.random() * randomNames.length)];
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [
                ...q.answers,
                {
                  id: Date.now().toString(),
                  text: answerText.trim(),
                  author: randomAuthor,
                  timestamp: "Just now",
                  upvotes: 0,
                  downvotes: 0,
                  userVote: null,
                },
              ],
            }
          : q
      )
    );
    setNewAnswers((prev) => ({ ...prev, [questionId]: "" }));
  };

  const handleVote = (
    questionId: string,
    voteType: "up" | "down",
    answerId?: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? answerId
            ? {
                ...q,
                answers: q.answers.map((a) =>
                  a.id === answerId
                    ? {
                        ...a,
                        upvotes:
                          voteType === "up" && a.userVote !== "up"
                            ? a.upvotes + (a.userVote === "down" ? 2 : 1)
                            : voteType === "up" && a.userVote === "up"
                            ? a.upvotes - 1
                            : a.upvotes,
                        downvotes:
                          voteType === "down" && a.userVote !== "down"
                            ? a.downvotes + (a.userVote === "up" ? 2 : 1)
                            : voteType === "down" && a.userVote === "down"
                            ? a.downvotes - 1
                            : a.downvotes,
                        userVote: a.userVote === voteType ? null : voteType,
                      }
                    : a
                ),
              }
            : {
                ...q,
                upvotes:
                  voteType === "up" && q.userVote !== "up"
                    ? q.upvotes + (q.userVote === "down" ? 2 : 1)
                    : voteType === "up" && q.userVote === "up"
                    ? q.upvotes - 1
                    : q.upvotes,
                downvotes:
                  voteType === "down" && q.userVote !== "down"
                    ? q.downvotes + (q.userVote === "up" ? 2 : 1)
                    : voteType === "down" && q.userVote === "down"
                    ? q.downvotes - 1
                    : q.downvotes,
                userVote: q.userVote === voteType ? null : voteType,
              }
          : q
      )
    );
  };

  const getNetScore = (upvotes: number, downvotes: number) =>
    upvotes - downvotes;

  return (
    <div className="flex-1 bg-gradient-to-t from-customBlue to-white overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Q&A
          </h1>
          <p className="text-gray-600 mb-6">
            Connect with others on similar immigration journeys
          </p>

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <div className="flex gap-1">
                {[
                  { key: "popular", label: "Popular", icon: TrendingUp },
                  { key: "recent", label: "Recent", icon: Clock },
                  {
                    key: "most-answered",
                    label: "Most Answered",
                    icon: MessageCircle,
                  },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key as SortOption)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      sortBy === key
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Ask Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {sortedQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex">
                {/* Vote Section */}
                <div className="flex flex-col items-center p-4 bg-gray-50 border-r border-gray-200">
                  <button
                    onClick={() => handleVote(question.id, "up")}
                    className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                      question.userVote === "up"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    <ArrowUp size={20} className="text-green-600" />
                  </button>
                  <span
                    className={`font-bold text-sm ${
                      getNetScore(question.upvotes, question.downvotes) > 0
                        ? "text-blue-500"
                        : getNetScore(question.upvotes, question.downvotes) < 0
                        ? "text-blue-500"
                        : "text-gray-600"
                    }`}
                  >
                    {getNetScore(question.upvotes, question.downvotes)}
                  </span>
                  <button
                    onClick={() => handleVote(question.id, "down")}
                    className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                      question.userVote === "down"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    <ArrowDown size={20} className="text-red-600" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4">
                  {/* Question Header */}
                  <div className="mb-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {question.text}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span className="font-medium text-blue-600">
                          u/{question.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{question.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        <span>{question.answers.length} comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Answers */}
                  {question.answers.length > 0 && (
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="space-y-3">
                        {question.answers.map((answer) => (
                          <div key={answer.id} className="flex gap-3">
                            {/* Answer Vote Section */}
                            <div className="flex flex-col items-center">
                              <button
                                onClick={() =>
                                  handleVote(question.id, "up", answer.id)
                                }
                                className={`p-0.5 rounded hover:bg-gray-200 transition-colors ${
                                  answer.userVote === "up"
                                    ? "text-blue-500"
                                    : "text-gray-400"
                                }`}
                              >
                                <ArrowUp size={14} className="text-green-600" />
                              </button>
                              <span
                                className={`text-xs font-medium ${
                                  getNetScore(
                                    answer.upvotes,
                                    answer.downvotes
                                  ) > 0
                                    ? "text-blue-500"
                                    : getNetScore(
                                        answer.upvotes,
                                        answer.downvotes
                                      ) < 0
                                    ? "text-blue-500"
                                    : "text-gray-600"
                                }`}
                              >
                                {getNetScore(answer.upvotes, answer.downvotes)}
                              </span>
                              <button
                                onClick={() =>
                                  handleVote(question.id, "down", answer.id)
                                }
                                className={`p-0.5 rounded hover:bg-gray-200 transition-colors ${
                                  answer.userVote === "down"
                                    ? "text-blue-500"
                                    : "text-gray-400"
                                }`}
                              >
                                <ArrowDown size={14} className="text-red-600" />
                              </button>
                            </div>

                            {/* Answer Content */}
                            <div className="flex-1">
                              <p className="text-gray-800 mb-2">
                                {answer.text}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="font-medium text-blue-600">
                                  u/{answer.author}
                                </span>
                                <span>{answer.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Answer */}
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newAnswers[question.id] || ""}
                        onChange={(e) =>
                          setNewAnswers((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddAnswer(question.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddAnswer(question.id)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                      >
                        <Send size={14} />
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Adding Question */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Create a post
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm text-gray-600">
                      Posting as u/YourUsername
                    </span>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What's your question?"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Be specific and clear to get the best answers from the
                  community.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityQnATab;
