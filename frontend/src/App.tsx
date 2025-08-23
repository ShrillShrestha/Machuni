import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatTab from './components/ChatTab';
import EventsTab from './components/EventsTab';
import { UserPreferences } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'events'>('chat');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    visaStatus: '',
    city: '',
    interests: []
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
      <Sidebar 
        preferences={userPreferences}
        onPreferencesChange={setUserPreferences}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Tab Navigation */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="flex space-x-1 p-4">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Immigration Assistant
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'events'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Local Events
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'chat' ? (
            <ChatTab preferences={userPreferences} />
          ) : (
            <EventsTab preferences={userPreferences} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;