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
              name: 'Current Location',
              country: '',
              lat: latitude,
              lon: longitude,
            });
          }
        } catch (err) {
          console.error('Reverse geocode error:', err);
          setLocation({
            name: 'Current Location',
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
          text-indigo-600 dark:text-indigo-400
          bg-indigo-50 dark:bg-indigo-950/50
          hover:bg-indigo-100 dark:hover:bg-indigo-950
          border border-indigo-200 dark:border-indigo-900
          transition-colors duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isDetecting ? (
          <>
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>{t('location.detecting')}</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-5.364l-1.414 1.414M8.05 15.95l-1.414 1.414m0-10.728l1.414 1.414m7.314 7.314l1.414 1.414"
              />
            </svg>
            <span>{t('location.current')}</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-rose-500 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
