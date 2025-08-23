import React, { useState, useRef, useEffect } from "react";
import { Bot, User, Menu, ArrowUp } from "lucide-react";
import {
  Message,
  PresetQuestion,
  UserPreferences,
  ChatRequest,
  ChatResponse,
} from "../types";
import { useChatContext } from "../context/ChatContext";
import PresetQuestions from "./PresetQuestions";
import AvatarIdle from "./AvatarIdle";

interface ChatTabProps {
  preferences: UserPreferences;
  onToggleSidebar: () => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ preferences, onToggleSidebar }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your immigration assistant. I can help you with visa questions, legal processes, and finding the right resources. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addChatResponse } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasUserMessages = messages.some((m) => m.sender === "user");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Clear any previous errors
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Prepare the chat request payload
      const chatRequest: ChatRequest = {
        status: preferences.visaStatus,
        interests: preferences.interests,
        country: preferences.country,
        state: preferences.state,
        language_preferance: preferences.language_preference,
        question: text.trim(),
      };

      // Make API call to the chat endpoint
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const chatResponse: ChatResponse = await response.json();

      // Store the response in chat history
      addChatResponse(chatResponse);

      // Add bot response to messages
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: chatResponse.answer,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);

      // Fallback response in case of error
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handlePresetClick = (question: PresetQuestion) => {
    sendMessage(question.text);
  };

  // const clearAllChat = () => {
  //   setMessages([
  //     {
  //       id: "1",
  //       text: "Hello! I'm your immigration assistant. I can help you with visa questions, legal processes, and finding the right resources. How can I assist you today?",
  //       sender: "bot",
  //       timestamp: new Date(),
  //     },
  //   ]);
  //   clearChatHistory();
  // };

  // const getChatHistoryDisplay = () => {
  //   if (chatHistory.length === 0) return null;

  //   return (
  //     <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
  //       <div className="flex items-center justify-between mb-3">
  //         <h3 className="text-lg font-semibold text-gray-800">
  //           Previous Responses
  //         </h3>
  //         <div className="flex gap-2">
  //           <button
  //             onClick={clearChatHistory}
  //             className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
  //           >
  //             Clear History
  //           </button>
  //           <button
  //             onClick={clearAllChat}
  //             className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
  //           >
  //             Clear All
  //           </button>
  //         </div>
  //       </div>
  //       <div className="space-y-3">
  //         {chatHistory.map((response, index) => (
  //           <div
  //             key={index}
  //             className="p-3 bg-blue-50/50 rounded-xl border border-blue-200"
  //           >
  //             <p className="text-sm text-gray-600 mb-1">
  //               Response #{index + 1}
  //             </p>
  //             <p className="text-gray-800">{response.answer}</p>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="flex flex-col h-screen bg-blue-50/40 backdrop-blur-2xl shadow-xl">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-customBlue to-white rounded-lg shadow-xl -z-10"></div>

      {/* === EMPTY STATE === */}
      {!hasUserMessages ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-3xl sm:max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 flex flex-col items-center space-y-6">
            <AvatarIdle />

            {/* Greeting */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-sm text-gray-800 text-center max-w-lg">
              {messages[0].text}
            </div>

            {/* FAQ + Input stacked */}
            <div className="w-full space-y-3">
              {error && (
                <div className="flex items-center gap-2 text-red-500 italic bg-red-50 p-3 rounded-xl border border-red-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-alert-triangle"
                  >
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <PresetQuestions
                preferences={preferences}
                onQuestionClick={handlePresetClick}
                compact
              />

              <form
                onSubmit={handleSubmit}
                className="flex gap-3 bg-white/80 backdrop-blur-lg p-3 rounded-2xl border border-gray-200 shadow-md"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-4 h-14 rounded-xl outline-none text-gray-900 placeholder-gray-500 text-base bg-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
              </form>
            </div>

            {/* Chat History Display in Empty State */}
            {/* {getChatHistoryDisplay()} */}
          </div>
        </div>
      ) : (
        /* === CHAT LAYOUT AFTER MESSAGE === */
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Always keep avatar at top */}
              <div className="flex justify-center sticky -top-4 bg-gradient-to-br from-blue-50 to-indigo-100/40 backdrop-blur-lg z-10">
                <AvatarIdle />
              </div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end gap-3 max-w-xs sm:max-w-md lg:max-w-2xl ${
                      message.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-violet-600"
                          : "bg-white border border-gray-300"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm whitespace-pre-line ${
                        message.sender === "user"
                          ? "bg-violet-600 text-white rounded-br-md"
                          : "bg-white/70 backdrop-blur-sm text-gray-900 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-gray-600 italic">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>Assistant is thinking...</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-500 italic bg-red-50 p-3 rounded-xl border border-red-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-alert-triangle"
                  >
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Chat History Display */}
              {/* {getChatHistoryDisplay()} */}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom: FAQ + Input */}
          <div className="border-t border-gray-200 bg-white/40 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto px-4 py-3 space-y-3">
              <PresetQuestions
                preferences={preferences}
                onQuestionClick={handlePresetClick}
                compact
              />

              <form
                onSubmit={handleSubmit}
                className="flex gap-3 bg-white/80 backdrop-blur-lg p-3 rounded-2xl border border-gray-200 shadow-md"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-4 h-14 rounded-xl outline-none text-gray-900 placeholder-gray-500 text-base bg-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatTab;
