import React, { useState } from "react";
import ChatTab from "./components/ChatTab";
import EventsTab from "./components/EventsTab";
import CommunityQnATab from "./components/CommunityQnATab";
import { UserPreferences } from "./types";
import { ChatProvider } from "./context/ChatContext";
import FAQsTab from "./components/FAQsTab";
import Sidebar from "./components/Sidebar";
import { Menu } from "lucide-react";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "chat" | "events" | "community" | "faqs"
  >("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    visaStatus: "",
    state: "",
    country: "",
    language_preference: "English",
    interests: [],
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handlePreferencesChange = (newPreferences: UserPreferences) => {
    setUserPreferences(newPreferences);
  };

  const handlePageChange = (page: "chat" | "events" | "community" | "faqs") => {
    setCurrentPage(page);
  };

  const renderCurrentTab = () => {
    switch (currentPage) {
      case "chat":
        return (
          <ChatTab
            preferences={userPreferences}
            onToggleSidebar={toggleSidebar}
          />
        );
      case "events":
        return (
          <EventsTab
            preferences={userPreferences}
            onToggleSidebar={toggleSidebar}
          />
        );
      case "community":
        return <CommunityQnATab />;
      case "faqs":
        return (
          <FAQsTab
            preferences={userPreferences}
            onToggleSidebar={toggleSidebar}
          />
        );
      default:
        return (
          <ChatTab
            preferences={userPreferences}
            onToggleSidebar={toggleSidebar}
          />
        );
    }
  };

  return (
    <ChatProvider>
      <div
        className="
          relative flex
          min-h-screen min-h-[100dvh] min-h-[100svh]
          overflow-hidden
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Sidebar (persistent on desktop) */}
        <div className="hidden lg:block">
          <Sidebar
            preferences={userPreferences}
            onPreferencesChange={setUserPreferences}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isOpen={true}
            onClose={closeSidebar}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        <main className="flex-1 flex flex-col w-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <div className="lg:hidden p-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          {renderCurrentTab()}
        </main>

        {/* Mobile Sidebar Overlay (covers entire screen on iOS) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sliding panel */}
            <div
              className="
                absolute left-0 top-0
                h-[100dvh] w-72 max-w-[80vw]
                bg-white shadow-2xl
                overflow-y-auto
                pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
              "
            >
              <Sidebar
                preferences={userPreferences}
                onPreferencesChange={setUserPreferences}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isOpen={true}
                onClose={closeSidebar}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            </div>
          </div>
        )}
      </div>
    </ChatProvider>
  );
}

export default App;
