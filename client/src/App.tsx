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
import { useChat, useSession, useLanguage } from "./context";
import { locationApi } from "./services/api";

function App() {
  const { weather, location, setLocation } = useChat();
  const { activeSession, createSession } = useSession();
  const { t } = useLanguage();

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
                name: t('location.currentLocation'),
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-950">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-neutral-400 dark:text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          {t('chat.noActiveConversation')}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-6">
          {t('chat.startDescription')}
        </p>
        <button
          onClick={() => createSession()}
          className="
            inline-flex items-center gap-2
            px-5 py-2.5 rounded-lg
            bg-neutral-900 hover:bg-neutral-800
            dark:bg-neutral-100 dark:hover:bg-neutral-200
            text-white dark:text-neutral-900
            text-sm font-medium
            transition-colors duration-150
            shadow-sm
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t('chat.startButton')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sessions Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden">
          {activeSession ? (
            <>
              {/* Chat Area - Main, no border/container */}
              <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 dark:bg-neutral-950">
                <ChatContainer />
              </div>

              {/* Right Sidebar - Weather & Location (Desktop) */}
              <aside className="hidden lg:flex w-80 flex-col gap-4 p-4 border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto custom-scrollbar bg-white dark:bg-neutral-950">
                {/* Location Section */}
                <div className="card p-4">
                  <h3 className="text-xs font-semibold text-neutral-700 dark:text-neutral-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    {t('location.label')}
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
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <LocationSearch />
            </div>
            {!location && <CurrentLocationButton />}
          </div>
          {weather && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
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
