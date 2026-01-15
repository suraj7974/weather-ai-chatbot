import { useState } from 'react';
import { useLanguage, useChat } from '../../context';
import { locationApi } from '../../services/api';

export function CurrentLocationButton() {
  const { t } = useLanguage();
  const { setLocation } = useChat();
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setError(t('error.location'));
      return;
    }

    setIsDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const locationData = await locationApi.reverseGeocode(latitude, longitude);
          if (locationData) {
            setLocation(locationData);
          } else {
            setLocation({
              name: t('location.currentLocation'),
              country: '',
              lat: latitude,
              lon: longitude,
            });
          }
        } catch (err) {
          console.error('Reverse geocode error:', err);
          setLocation({
            name: t('location.currentLocation'),
            country: '',
            lat: latitude,
            lon: longitude,
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError(t('error.location'));
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <div>
      <button
        onClick={handleGetLocation}
        disabled={isDetecting}
        className="
          w-full flex items-center justify-center gap-2
          px-3 py-2 rounded-lg
          text-sm font-medium
          text-neutral-600 dark:text-neutral-400
          bg-neutral-100 dark:bg-neutral-900
          hover:bg-neutral-200 dark:hover:bg-neutral-800
          border border-neutral-200 dark:border-neutral-800
          transition-colors duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isDetecting ? (
          <>
            <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
            <span>{t('location.detecting')}</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
            <span>{t('location.current')}</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
