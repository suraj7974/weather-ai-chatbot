import { useEffect } from "react";
import {
  Header,
  ChatContainer,
  WeatherCard,
  ForecastList,
  LocationSearch,
  CurrentLocationButton,
  Sidebar,
} from "./components";
import { useChat, useSession } from "./context";
import { locationApi } from "./services/api";

function App() {
  const { weather, location, setLocation } = useChat();
  const { activeSession, createSession } = useSession();

  // Auto-detect location on first load (only if there's an active session)
  useEffect(() => {
    if (!activeSession || location) return;

    const detectLocation = async () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const locationData = await locationApi.reverseGeocode(
              latitude,
              longitude,
            );
            if (locationData) {
              setLocation(locationData);
            } else {
              setLocation({
                name: "Current Location",
                country: "",
                lat: latitude,
                lon: longitude,
              });
            }
          } catch (err) {
            console.error("Auto-detect location failed:", err);
          }
        },
        (err) => {
          console.log(
            "Geolocation permission denied or unavailable:",
            err.message,
          );
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    };

    detectLocation();
  }, [activeSession, location, setLocation]);

  // Empty state - no active session
  const EmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
          No active chat
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          Start a new conversation to get weather information and travel
          recommendations.
        </p>
        <button
          onClick={() => createSession()}
          className="
            inline-flex items-center gap-2
            px-6 py-3 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            text-white font-medium
            transition-colors duration-200
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Start New Chat
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sessions Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden">
          {activeSession ? (
            <>
              {/* Chat Area - Main, no border/container */}
              <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-900">
                <ChatContainer />
              </div>

              {/* Right Sidebar - Weather & Location (Desktop) */}
              <aside className="hidden lg:flex w-80 flex-col gap-4 p-4 border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950">
                {/* Location Section */}
                <div className="card p-4">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Location
                  </h3>
                  <LocationSearch />
                  {!location && (
                    <div className="mt-3">
                      <CurrentLocationButton />
                    </div>
                  )}
                </div>

                {/* Weather Card */}
                {weather && <WeatherCard weather={weather} />}

                {/* Forecast */}
                <ForecastList />
              </aside>
            </>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      {/* Mobile Location Bar - only show when there's an active session */}
      {activeSession && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <LocationSearch />
            </div>
            {!location && <CurrentLocationButton />}
          </div>
          {weather && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">
                {weather.city}: {weather.temp}°C, {weather.condition}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
