import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Filter, Star } from 'lucide-react';
import { Event, UserPreferences } from '../types';

interface EventsTabProps {
  preferences: UserPreferences;
}

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Immigration Workshop: Know Your Rights',
    date: '2024-01-15',
    time: '2:00 PM',
    location: 'Community Center Downtown',
    description: 'Free workshop covering basic immigration rights and resources available to new immigrants.',
    category: 'Legal Services',
    image: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Job Fair for International Professionals',
    date: '2024-01-18',
    time: '10:00 AM',
    location: 'Convention Center',
    description: 'Connect with employers looking for international talent. Bring your resume and work authorization documents.',
    category: 'Job Search',
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'English Conversation Club',
    date: '2024-01-12',
    time: '6:30 PM',
    location: 'Public Library Main Branch',
    description: 'Practice English conversation skills in a friendly, supportive environment. All levels welcome.',
    category: 'Language Learning',
    image: 'https://images.pexels.com/photos/159844/books-students-library-university-159844.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    title: 'Cultural Festival: Celebrating Diversity',
    date: '2024-01-20',
    time: '12:00 PM',
    location: 'City Park',
    description: 'Join us for a celebration of cultures with food, music, and dance from around the world.',
    category: 'Cultural Events',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    title: 'Housing Workshop for New Residents',
    date: '2024-01-22',
    time: '1:00 PM',
    location: 'Housing Authority Office',
    description: 'Learn about tenant rights, finding affordable housing, and understanding lease agreements.',
    category: 'Housing',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    title: 'Healthcare Navigation Seminar',
    date: '2024-01-25',
    time: '3:00 PM',
    location: 'Health Center Auditorium',
    description: 'Understanding the healthcare system, insurance options, and accessing medical services.',
    category: 'Healthcare',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const EventsTab: React.FC<EventsTabProps> = ({ preferences }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    // Simulate fetching events based on user preferences
    const userEvents = sampleEvents.filter(event => {
      if (preferences.city && !event.location.toLowerCase().includes(preferences.city.toLowerCase())) {
        return false;
      }
      if (preferences.interests.length > 0) {
        return preferences.interests.some(interest => 
          event.category === interest || 
          event.title.toLowerCase().includes(interest.toLowerCase()) ||
          event.description.toLowerCase().includes(interest.toLowerCase())
        );
      }
      return true;
    });
    
    setEvents(userEvents.length > 0 ? userEvents : sampleEvents);
  }, [preferences]);

  useEffect(() => {
    const filtered = selectedCategory 
      ? events.filter(event => event.category === selectedCategory)
      : events;
    setFilteredEvents(filtered);
  }, [events, selectedCategory]);

  const categories = Array.from(new Set(events.map(event => event.category)));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Local Events {preferences.city && `in ${preferences.city}`}
          </h1>
          <p className="text-slate-400">
            Discover events tailored to your interests and immigration journey
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Filter by category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              All Events
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full">
                    {event.category}
                  </span>
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No events found</h3>
            <p className="text-slate-500">
              Try adjusting your filters or check back later for new events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsTab;