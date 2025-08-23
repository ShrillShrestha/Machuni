export interface UserPreferences {
  visaStatus: string;
  state: string;
  country: string;
  language_preference: string;
  interests: string[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

export interface PresetQuestion {
  id: string;
  text: string;
  category: string;
  visaStatuses: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  image: string;
}

export interface ChatRequest {
  status: string;
  interests: string[];
  country: string;
  state: string;
  language_preferance: string;
  question: string;
}

export interface ChatResponse {
  answer: string;
}

export interface FAQRequest {
  status: string;
  language_preferance: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQResponse {
  faqs: FAQItem[];
}

export interface VisaStatusOption {
  label: string;
  value: string;
}