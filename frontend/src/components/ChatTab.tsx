import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Message, PresetQuestion, UserPreferences } from '../types';
import PresetQuestions from './PresetQuestions';

interface ChatTabProps {
  preferences: UserPreferences;
}

const ChatTab: React.FC<ChatTabProps> = ({ preferences }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your immigration assistant. I can help you with visa questions, legal processes, and finding the right resources. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text, preferences),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (question: string, prefs: UserPreferences): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('visa') || lowerQuestion.includes('status')) {
      return `Based on your ${prefs.visaStatus || 'current status'}, here are the key requirements you should know about. For specific visa applications, I recommend consulting with an immigration attorney. Would you like me to help you find legal resources in ${prefs.city || 'your area'}?`;
    }
    
    if (lowerQuestion.includes('work') || lowerQuestion.includes('job')) {
      return `For work authorization, this depends on your current status. ${prefs.visaStatus ? `As someone with ${prefs.visaStatus} status, you may have specific work permissions.` : 'Your visa status determines your work eligibility.'} I can help you understand the process better. Would you like information about work permits or job search resources?`;
    }
    
    if (lowerQuestion.includes('green card') || lowerQuestion.includes('permanent')) {
      return 'The path to permanent residence varies based on your current status and circumstances. Common paths include family sponsorship, employment-based applications, and asylum/refugee status. Would you like me to explain the process that might apply to your situation?';
    }
    
    return 'I understand your question. Immigration law can be complex, and each case is unique. For personalized advice, I recommend consulting with a qualified immigration attorney. In the meantime, I can provide general information and help you find relevant resources. What specific aspect would you like to explore further?';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handlePresetClick = (question: PresetQuestion) => {
    sendMessage(question.text);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-3 max-w-3xl ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <div className={`p-2 rounded-full ${
                message.sender === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-slate-700'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <div className={`p-4 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-200'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-700 rounded-full">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="p-4 bg-slate-700/50 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Questions */}
      <PresetQuestions 
        preferences={preferences} 
        onQuestionClick={handlePresetClick}
      />

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-slate-700">
        <div className="flex gap-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything about immigration..."
            className="flex-1 p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatTab;