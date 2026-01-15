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
      <div className="card p-4">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!forecast) return null;

  const getWeatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };

  return (
    <div className="card p-4 animate-fadeIn">
      <h3 className="text-xs font-semibold text-neutral-700 dark:text-neutral-400 uppercase tracking-wide mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        {t('weather.forecast')}
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {forecast.items.slice(0, 5).map((item: ForecastItem, index: number) => (
          <div
            key={index}
            className="
              flex-shrink-0 flex flex-col items-center
              bg-neutral-100 dark:bg-neutral-900
              hover:bg-neutral-200 dark:hover:bg-neutral-800
              rounded-lg p-2.5 min-w-[60px]
              transition-colors duration-150
            "
          >
            <span className="text-xs font-medium text-neutral-500">
              {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            <img
              src={getWeatherIconUrl(item.icon)}
              alt={item.condition}
              className="w-8 h-8"
            />
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {Math.round(item.tempMax)}°
              </span>
              <span className="text-xs text-neutral-400">
                {Math.round(item.tempMin)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
