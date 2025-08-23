import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatResponse } from '../types';

interface ChatContextType {
  chatHistory: ChatResponse[];
  addChatResponse: (response: ChatResponse) => void;
  clearChatHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<ChatResponse[]>([]);

  const addChatResponse = (response: ChatResponse) => {
    setChatHistory((prev) => [...prev, response]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <ChatContext.Provider value={{ chatHistory, addChatResponse, clearChatHistory }}>
      {children}
    </ChatContext.Provider>
  );
};
