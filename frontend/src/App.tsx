import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatTab from "./components/ChatTab";
import EventsTab from "./components/EventsTab";
import { UserPreferences } from "./types";

function App() {
  const [currentPage, setCurrentPage] = useState<"chat" | "events">("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    visaStatus: "",
    city: "",
    interests: [],
  });

  // Prevent background scroll when the mobile sidebar is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isSidebarOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isSidebarOpen]);

  return (
    <div
      className="
        relative flex
        min-h-screen min-h-[100dvh] min-h-[100svh]
        overflow-hidden
      "
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-shift"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-purple-200/25 rounded-full blur-3xl animate-float-fast"></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-cyan-200/15 rounded-full blur-3xl animate-float-medium"></div>
        
        {/* Subtle mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5"></div>
      </div>
      {/* Sidebar (persistent on desktop) */}
      <div className="hidden lg:block">
        <Sidebar
          preferences={userPreferences}
          onPreferencesChange={setUserPreferences}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isOpen={true}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col w-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        {currentPage === "chat" ? (
          <ChatTab
            preferences={userPreferences}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        ) : (
          <EventsTab
            preferences={userPreferences}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}
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
              onPageChange={setCurrentPage}
              isOpen={true}
              onToggle={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
