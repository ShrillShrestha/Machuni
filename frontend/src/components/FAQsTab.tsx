import React, { useState, useEffect } from "react";
import { HelpCircle, Search, Filter, Menu } from "lucide-react";
import { FAQItem, FAQRequest, FAQResponse, UserPreferences } from "../types";

interface FAQsTabProps {
  preferences: UserPreferences;
  onToggleSidebar: () => void;
}

const FAQsTab: React.FC<FAQsTabProps> = ({ preferences, onToggleSidebar }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch FAQs based on user preferences
  const fetchFAQs = async () => {
    if (!preferences.visaStatus || !preferences.language_preference) {
      setFaqs([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestBody: FAQRequest = {
        status: preferences.visaStatus,
        language_preferance: preferences.language_preference,
      };

      const response = await fetch("http://127.0.0.1:5000/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FAQResponse = await response.json();
      setFaqs(data.faqs || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch FAQs");
      setFaqs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [preferences.visaStatus, preferences.language_preference]);

  // Filter FAQs based on search term and category
  useEffect(() => {
    let filtered = faqs;

    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    setFilteredFaqs(filtered);
  }, [faqs, searchTerm, selectedCategory]);

  const categories = Array.from(
    new Set(faqs.map((faq) => faq.category).filter(Boolean))
  );

  const getStatusDisplay = () => {
    if (!preferences.visaStatus || !preferences.language_preference) {
      return "Please select your visa status and language preference in the sidebar to see relevant FAQs.";
    }
    return `Showing FAQs for ${preferences.visaStatus} in ${preferences.language_preference}`;
  };

  return (
    <div className="h-screen bg-gradient-to-t from-customBlue to-white overflow-y-auto">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-100 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-blue-800">FAQs</h1>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-black mb-4 text-l italic">
              {getStatusDisplay()}
            </p>

            {!preferences.visaStatus || !preferences.language_preference ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Setup Required</span>
                </div>
                <p className="text-blue-700 mt-2 text-sm">
                  To see personalized FAQs, please select your visa status and
                  language preference in the sidebar.
                </p>
              </div>
            ) : null}
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all duration-200 bg-white"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-700">
                  Filter by category:
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading FAQs...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <HelpCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading FAQs
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchFAQs}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* FAQs Grid */}
          {!isLoading && !error && filteredFaqs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2 lg:gap-10">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="group bg-white rounded-2xl border border-white-300 p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[180px]"
                >
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Category Badge */}
                    {faq.category && (
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-hwite-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                          {faq.category}
                        </span>
                      </div>
                    )}

                    {/* Question */}
                    <h3 className="text-lg font-bold text-blue-800 mb-4 leading-tight">
                      {faq.question}
                    </h3>

                    {/* Answer */}
                    <p className="text-gray-800 leading-relaxed text-md">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading &&
            !error &&
            filteredFaqs.length === 0 &&
            faqs.length > 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No FAQs found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or category filter.
                </p>
              </div>
            )}

          {/* No FAQs Available */}
          {!isLoading &&
            !error &&
            faqs.length === 0 &&
            preferences.visaStatus &&
            preferences.language_preference && (
              <div className="text-center py-16">
                <HelpCircle className="w-16 h-16 text-black mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-black mb-2">
                  No FAQs available
                </h3>
                <p className="text-black text-md">
                  No FAQs found for your current preferences. Try selecting
                  different options.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FAQsTab;
