import React, { useState, useRef, useEffect } from "react";
import { Bot, User, Menu, ArrowUp } from "lucide-react";
import { Message, PresetQuestion, UserPreferences } from "../types";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasUserMessages = messages.some((m) => m.sender === "user");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Here’s a helpful response for you.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handlePresetClick = (question: PresetQuestion) => {
    sendMessage(question.text);
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50/40 backdrop-blur-2xl shadow-xl">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-customBlue to-white rounded-lg shadow-xl -z-10"></div>

      {/* Header (mobile only) */}
      <div className="lg:hidden bg-white/70 backdrop-blur-md border-b border-gray-200 p-4 sticky top-0 z-10 flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            Immigration AI
          </h1>
        </div>
      </div>

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
                          ? "bg-blue-600"
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
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white/70 backdrop-blur-sm text-gray-900 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="text-gray-600 italic">
                  Assistant is typing...
                </div>
              )}
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
