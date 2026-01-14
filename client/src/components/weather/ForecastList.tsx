import { useState, useEffect } from 'react';
import type { ForecastData, ForecastItem } from '../../types';
import { useLanguage, useChat } from '../../context';
import { weatherApi } from '../../services/api';

export function ForecastList() {
  const { t } = useLanguage();
  const { location } = useChat();
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setForecast(null);
      return;
    }

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await weatherApi.getForecast(location.lat, location.lon);
        setForecast(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch forecast');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [location]);

  if (!location) return null;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <div className="animate-pulse flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 h-24 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl p-4">
        {error}
      </div>
    );
  }

  if (!forecast) return null;

  const getWeatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t('weather.forecast')}
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {forecast.items.slice(0, 5).map((item: ForecastItem, index: number) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3 min-w-[80px]"
          >
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            <img
              src={getWeatherIconUrl(item.icon)}
              alt={item.condition}
              className="w-10 h-10"
            />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {Math.round(item.tempMax)}°
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(item.tempMin)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
