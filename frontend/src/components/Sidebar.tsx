import React from 'react';
import { Settings, MapPin, Heart, Users } from 'lucide-react';
import { UserPreferences } from '../types';

interface SidebarProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

const visaStatuses = [
  'Student Visa',
  'Work Visa',
  'Tourist Visa',
  'Permanent Resident',
  'Citizen',
  'Asylum Seeker',
  'Refugee Status'
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
];

const interests = [
  'Job Search', 'Housing', 'Education', 'Healthcare', 'Legal Services',
  'Language Learning', 'Networking', 'Cultural Events', 'Sports', 'Arts'
];

const Sidebar: React.FC<SidebarProps> = ({ preferences, onPreferencesChange }) => {
  const updatePreference = (key: keyof UserPreferences, value: any) => {
    onPreferencesChange({ ...preferences, [key]: value });
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = preferences.interests;
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    updatePreference('interests', updatedInterests);
  };

  return (
    <div className="w-80 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700 p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Preferences</h2>
      </div>

      {/* Visa Status */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-blue-400" />
          <label className="text-sm font-medium text-slate-300">Current Status</label>
        </div>
        <select
          value={preferences.visaStatus}
          onChange={(e) => updatePreference('visaStatus', e.target.value)}
          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select your status</option>
          {visaStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-green-400" />
          <label className="text-sm font-medium text-slate-300">City</label>
        </div>
        <select
          value={preferences.city}
          onChange={(e) => updatePreference('city', e.target.value)}
          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select your city</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Interests */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-red-400" />
          <label className="text-sm font-medium text-slate-300">Interests</label>
        </div>
        <div className="space-y-2">
          {interests.map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                preferences.interests.includes(interest)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;