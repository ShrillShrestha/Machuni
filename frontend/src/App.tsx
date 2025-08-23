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
        bg-gradient-to-br from-blue-50 to-indigo-100
      "
      style={{ WebkitOverflowScrolling: "touch" }}
    >
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
