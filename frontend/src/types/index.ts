export interface UserPreferences {
  visaStatus: string;
  city: string;
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