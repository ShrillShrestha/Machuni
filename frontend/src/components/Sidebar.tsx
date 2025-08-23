import React from "react";
import {
  X,
  Settings,
  User,
  MapPin,
  Globe,
  Languages,
  MessageSquare,
  Calendar,
  HelpCircle,
} from "lucide-react";
import { UserPreferences, VisaStatusOption } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  currentPage: "chat" | "events" | "faqs" | "community";
  onPageChange: (page: "chat" | "events" | "faqs" | "community") => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  preferences,
  onPreferencesChange,
  currentPage,
  onPageChange,
}) => {
  const visaStatuses: VisaStatusOption[] = [
    { label: "Student (F1)", value: "F1" },
    { label: "Student (M1)", value: "M1" },
    { label: "Exchange Visitor (J1)", value: "J1" },
    { label: "Temporary Worker (H1B)", value: "H1B" },
    { label: "Dependent (F2)", value: "F2" },
    { label: "Dependent (H4)", value: "H4" },
    { label: "Permanent Resident", value: "PR" },
    { label: "U.S. Citizen", value: "USC" },
    { label: "Other", value: "OTHER" },
  ];

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const countries = [
    "Canada",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Nepal",
  ];

  const languages = ["English", "Hindi", "Nepali"];

  const interests = [
    "Legal Services",
    "Job Search",
    "Language Learning",
    "Cultural Events",
    "Housing",
    "Healthcare",
    "Education",
    "Transportation",
    "Banking",
    "Social Services",
    "Technology",
    "Arts",
    "Sports",
    "Food",
    "Travel",
    "Business",
    "Science",
    "History",
    "Politics",
    "Environment",
  ];

  const handleVisaStatusChange = (value: string) => {
    onPreferencesChange({
      ...preferences,
      visaStatus: value,
    });
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = preferences.interests.includes(interest)
      ? preferences.interests.filter((i) => i !== interest)
      : [...preferences.interests, interest];

    onPreferencesChange({
      ...preferences,
      interests: newInterests,
    });
  };

  const handlePageChange = (page: "chat" | "events" | "community" | "faqs") => {
    onPageChange(page);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 h-screen bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } flex flex-col`}
    >
      <div className="flex-1 p-2 overflow-y-auto">
        {/* Header with close button for mobile */}
        <div className="flex items-center justify-between mb-9">
          <div className="flex flex-col items-center justify-center mt-8 w-full">
            <img
              src="/images/logo/logo.png"
              alt="CloudMonk Logo"
              className="w-48 h-16 rounded-lg object-contain"
            />
            <p className="text-xs text-gray-500 text-center">
              Immigration Assistant
            </p>
          </div>

          <button
            onClick={onClose}
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
                  ? "bg-customBlue text-white shadow-lg"
                  : "text-gray-700 hover:bg-lighterCustomBlue hover:text-white"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Immigration Assistant</span>
            </button>
            <button
              onClick={() => handlePageChange("events")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                currentPage === "events"
                  ? "bg-customBlue text-white shadow-lg"
                  : "text-gray-700 hover:bg-lighterCustomBlue hover:text-white"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Local Events</span>
            </button>
            <button
              onClick={() => handlePageChange("faqs")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                currentPage === "faqs"
                  ? "bg-customBlue text-white shadow-lg"
                  : "text-gray-700 hover:bg-customBlue hover:text-white"
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">FAQs</span>
            </button>
            <button
              onClick={() => handlePageChange("community")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                currentPage === "community"
                  ? "bg-customBlue text-white shadow-lg"
                  : "text-gray-700 hover:bg-lighterCustomBlue hover:text-white"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Community Q&A</span>
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
            <User className="w-4 h-4 text-blue-600" />
            <label className="text-sm font-medium text-gray-600">
              Current Status
            </label>
          </div>
          <select
            value={preferences.visaStatus}
            onChange={(e) => handleVisaStatusChange(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600/40 shadow-sm transition-all duration-200"
          >
            <option value="">Select your status</option>
            {visaStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-green-400" />
            <label className="text-sm font-medium text-gray-600">State</label>
          </div>
          <select
            value={preferences.state}
            onChange={(e) =>
              onPreferencesChange({
                ...preferences,
                state: e.target.value,
              })
            }
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 shadow-sm transition-all duration-200"
          >
            <option value="">Select your state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-blue-400" />
            <label className="text-sm font-medium text-gray-600">Country</label>
          </div>
          <select
            value={preferences.country}
            onChange={(e) =>
              onPreferencesChange({
                ...preferences,
                country: e.target.value,
              })
            }
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 shadow-sm transition-all duration-200"
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Language Preference */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Languages className="w-4 h-4 text-purple-400" />
            <label className="text-sm font-medium text-gray-600">
              Language Preference
            </label>
          </div>
          <select
            value={preferences.language_preference}
            onChange={(e) =>
              onPreferencesChange({
                ...preferences,
                language_preference: e.target.value,
              })
            }
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 shadow-sm transition-all duration-200"
          >
            <option value="">Select your language</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Interests */}
        <div className="mb-8 max-h-80 overflow-y-auto pr-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 text-red-400">🎯</div>
            <label className="text-sm font-medium text-gray-600">
              Interests
            </label>
          </div>
          <div className="space-y-2">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
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
