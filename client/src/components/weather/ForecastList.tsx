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
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 h-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400">
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
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {t('weather.forecast')}
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {forecast.items.slice(0, 5).map((item: ForecastItem, index: number) => (
          <div
            key={index}
            className="
              flex-shrink-0 flex flex-col items-center
              bg-zinc-50 dark:bg-zinc-800
              hover:bg-zinc-100 dark:hover:bg-zinc-700
              rounded-lg p-2.5 min-w-[60px]
              transition-colors duration-150
            "
          >
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            <img
              src={getWeatherIconUrl(item.icon)}
              alt={item.condition}
              className="w-8 h-8"
            />
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                {Math.round(item.tempMax)}°
              </span>
              <span className="text-xs text-zinc-400">
                {Math.round(item.tempMin)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
