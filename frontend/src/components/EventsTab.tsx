import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Filter,
  Star,
  Menu,
  ArrowLeft,
} from "lucide-react";
import { Event, UserPreferences } from "../types";

interface EventsTabProps {
  preferences: UserPreferences;
  onToggleSidebar: () => void;
}

const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Immigration Workshop: Know Your Rights",
    date: "2024-01-15",
    time: "2:00 PM",
    location: "Community Center Downtown",
    description:
      "Free workshop covering basic immigration rights and resources available to new immigrants.",
    category: "Legal Services",
    image:
      "https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "2",
    title: "Job Fair for International Professionals",
    date: "2024-01-18",
    time: "10:00 AM",
    location: "Convention Center",
    description:
      "Connect with employers looking for international talent. Bring your resume and work authorization documents.",
    category: "Job Search",
    image:
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "3",
    title: "English Conversation Club",
    date: "2024-01-12",
    time: "6:30 PM",
    location: "Public Library Main Branch",
    description:
      "Practice English conversation skills in a friendly, supportive environment. All levels welcome.",
    category: "Language Learning",
    image:
      "https://images.pexels.com/photos/159844/books-students-library-university-159844.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "4",
    title: "Cultural Festival: Celebrating Diversity",
    date: "2024-01-20",
    time: "12:00 PM",
    location: "City Park",
    description:
      "Join us for a celebration of cultures with food, music, and dance from around the world.",
    category: "Cultural Events",
    image:
      "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "5",
    title: "Housing Workshop for New Residents",
    date: "2024-01-22",
    time: "1:00 PM",
    location: "Housing Authority Office",
    description:
      "Learn about tenant rights, finding affordable housing, and understanding lease agreements.",
    category: "Housing",
    image:
      "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "6",
    title: "Healthcare Navigation Seminar",
    date: "2024-01-25",
    time: "3:00 PM",
    location: "Health Center Auditorium",
    description:
      "Understanding the healthcare system, insurance options, and accessing medical services.",
    category: "Healthcare",
    image:
      "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const EventsTab: React.FC<EventsTabProps> = ({
  preferences,
  onToggleSidebar,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    // Simulate fetching events based on user preferences
    const userEvents = sampleEvents.filter((event) => {
      if (
        preferences.state &&
        !event.location.toLowerCase().includes(preferences.state.toLowerCase())
      ) {
        return false;
      }
      if (preferences.interests.length > 0) {
        return preferences.interests.some(
          (interest) =>
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
      ? events.filter((event) => event.category === selectedCategory)
      : events;
    setFilteredEvents(filtered);
  }, [events, selectedCategory]);

  const categories = Array.from(new Set(events.map((event) => event.category)));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-white to-gray-50/30 overflow-y-auto">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-100 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600/40 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              Local Events
            </h1>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-2">
              Local Events {preferences.state && `in ${preferences.state}`}
            </h1>
            <p className="text-gray-600">
              Discover events tailored to your interests and immigration journey
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-700">
                Filter by category
              </span>
            </div>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === ""
                    ? "bg-blue-600/40 text-black"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Events
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-blue-600/40 text-black"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:transform hover:scale-105 shadow-sm hover:shadow-md"
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
                    <span className="px-2 py-1 bg-gray-400/20 text-blue-800 text-xs font-medium rounded-full">
                      {event.category}
                    </span>
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <button className="w-full py-2 bg-blue-600/40 text-black rounded-lg hover:bg-blue-700 hover:text-white transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or check back later for new events.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsTab;
