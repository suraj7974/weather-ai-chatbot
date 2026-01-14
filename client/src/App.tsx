import {
  Header,
  ChatContainer,
  WeatherCard,
  ForecastList,
  LocationSearch,
  CurrentLocationButton,
} from './components';
import { useChat } from './context';

function App() {
  const { weather } = useChat();

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />

      <main className="flex-1 overflow-hidden p-4">
        <div className="h-full max-w-6xl mx-auto flex gap-4">
          {/* Sidebar - Weather & Location */}
          <aside className="hidden md:flex md:w-80 flex-col gap-4">
            {/* Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <LocationSearch />
              <div className="mt-2">
                <CurrentLocationButton />
              </div>
            </div>

            {/* Weather */}
            {weather && <WeatherCard weather={weather} />}

            {/* Forecast */}
            <ForecastList />
          </aside>

          {/* Main chat area */}
          <div className="flex-1 min-w-0">
            {/* Mobile location bar */}
            <div className="md:hidden mb-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <LocationSearch />
                </div>
                <CurrentLocationButton />
              </div>
            </div>

            {/* Mobile weather card */}
            {weather && (
              <div className="md:hidden mb-4">
                <WeatherCard weather={weather} />
              </div>
            )}

            {/* Chat */}
            <div className="h-full md:h-full">
              <ChatContainer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
