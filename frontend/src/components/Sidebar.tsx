import React from "react";
import {
  Settings,
  MapPin,
  Heart,
  Users,
  MessageSquare,
  Calendar,
  X,
} from "lucide-react";
import { UserPreferences } from "../types";

interface SidebarProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  currentPage: "chat" | "events";
  onPageChange: (page: "chat" | "events") => void;
  isOpen: boolean;
  onToggle: () => void;
}

const visaStatuses = [
  "Student Visa",
  "Work Visa",
  "Tourist Visa",
  "Permanent Resident",
  "Citizen",
  "Asylum Seeker",
  "Refugee Status",
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];

const interests = [
  "Job Search",
  "Housing",
  "Education",
  "Healthcare",
  "Legal Services",
  "Language Learning",
  "Networking",
  "Cultural Events",
  "Sports",
  "Arts",
];

const Sidebar: React.FC<SidebarProps> = ({
  preferences,
  onPreferencesChange,
  currentPage,
  onPageChange,
  isOpen,
  onToggle,
}) => {
  const updatePreference = (key: keyof UserPreferences, value: any) => {
    onPreferencesChange({ ...preferences, [key]: value });
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = preferences.interests;
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    updatePreference("interests", updatedInterests);
  };

  const handlePageChange = (page: "chat" | "events") => {
    onPageChange(page);
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };
  return (
    <div
      className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 h-screen bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } flex flex-col`}
    >
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header with close button for mobile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/40 rounded-lg">
              <Settings className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Immigration Hub</h2>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">
            Navigation
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handlePageChange("chat")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                currentPage === "chat"
                  ? "bg-blue-600/40 text-black shadow-lg"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Immigration Assistant</span>
            </button>
            <button
              onClick={() => handlePageChange("events")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                currentPage === "events"
                  ? "bg-blue-600/40 text-black shadow-lg"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Local Events</span>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">
            Preferences
          </h3>
        </div>

        {/* Visa Status */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-blue-600" />
            <label className="text-sm font-medium text-gray-600">
              Current Status
            </label>
          </div>
          <select
            value={preferences.visaStatus}
            onChange={(e) => updatePreference("visaStatus", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600/40 shadow-sm transition-all duration-200"
          >
            <option value="">Select your status</option>
            {visaStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-green-400" />
            <label className="text-sm font-medium text-gray-600">City</label>
          </div>
          <select
            value={preferences.city}
            onChange={(e) => updatePreference("city", e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 shadow-sm transition-all duration-200"
          >
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Interests */}
        <div className="mb-8 max-h-80 overflow-y-auto pr-2">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-red-400" />
            <label className="text-sm font-medium text-gray-600">
              Interests
            </label>
          </div>
          <div className="space-y-2">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                  preferences.interests.includes(interest)
                    ? "bg-blue-600/40 text-black shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
