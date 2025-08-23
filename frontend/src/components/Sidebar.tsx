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
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Slovakia",
  "Slovenia",
  "Croatia",
  "Serbia",
  "Bosnia and Herzegovina",
  "Montenegro",
  "North Macedonia",
  "Albania",
  "Greece",
  "Bulgaria",
  "Romania",
  "Moldova",
  "Ukraine",
  "Belarus",
  "Lithuania",
  "Latvia",
  "Estonia",
  "Russia",
  "Georgia",
  "Armenia",
  "Azerbaijan",
  "Turkey",
  "Cyprus",
  "Malta",
  "Iceland",
  "Ireland",
  "Portugal",
  "Luxembourg",
  "Liechtenstein",
  "Monaco",
  "Andorra",
  "San Marino",
  "Vatican City",
  "Australia",
  "New Zealand",
  "Japan",
  "South Korea",
  "China",
  "India",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Nepal",
  "Bhutan",
  "Myanmar",
  "Thailand",
  "Laos",
  "Cambodia",
  "Vietnam",
  "Malaysia",
  "Singapore",
  "Indonesia",
  "Philippines",
  "Brunei",
  "East Timor",
  "Papua New Guinea",
  "Fiji",
  "Vanuatu",
  "Solomon Islands",
  "New Caledonia",
  "Brazil",
  "Argentina",
  "Chile",
  "Peru",
  "Bolivia",
  "Paraguay",
  "Uruguay",
  "Ecuador",
  "Colombia",
  "Venezuela",
  "Guyana",
  "Suriname",
  "French Guiana",
];

const languages = ["English", "Hindi", "Nepali"];

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
                  ? "bg-customBlue text-white shadow-lg"
                  : "text-gray-700 hover:bg-customBlue hover:text-white"
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
                  : "text-gray-700 hover:bg-customBlue hover:text-white"
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

        {/* State */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-green-400" />
            <label className="text-sm font-medium text-gray-600">State</label>
          </div>
          <select
            value={preferences.state}
            onChange={(e) => updatePreference("state", e.target.value)}
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
            <MapPin className="w-4 h-4 text-blue-400" />
            <label className="text-sm font-medium text-gray-600">Country</label>
          </div>
          <select
            value={preferences.country}
            onChange={(e) => updatePreference("country", e.target.value)}
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
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <label className="text-sm font-medium text-gray-600">
              Language Preference
            </label>
          </div>
          <select
            value={preferences.language_preference}
            onChange={(e) =>
              updatePreference("language_preference", e.target.value)
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
