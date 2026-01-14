import type { WeatherData } from '../../types';
import { useLanguage } from '../../context';

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { t } = useLanguage();

  const getWeatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-xl p-4 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {weather.city}, {weather.country}
          </h3>
          <p className="text-blue-100 text-sm capitalize">{weather.condition}</p>
        </div>
        <img
          src={getWeatherIconUrl(weather.icon)}
          alt={weather.condition}
          className="w-16 h-16"
        />
      </div>

      {/* Temperature */}
      <div className="text-center mb-4">
        <span className="text-5xl font-light">{Math.round(weather.temp)}°</span>
        <span className="text-blue-200 ml-2">
          {t('weather.feelsLike')} {Math.round(weather.feelsLike)}°
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
          <span>{t('weather.humidity')}: {weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          <span>{t('weather.wind')}: {weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
}
