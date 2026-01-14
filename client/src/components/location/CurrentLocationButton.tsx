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
            // Fallback: create basic location data
            setLocation({
              name: 'Current Location',
              country: '',
              lat: latitude,
              lon: longitude,
            });
          }
        } catch (err) {
          console.error('Reverse geocode error:', err);
          // Still set location with coordinates
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
        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
      >
        {isDetecting ? (
          <>
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
                d="M12 2a10 10 0 00-7.071 2.929A10 10 0 002 12a10 10 0 0010 10 10 10 0 007.071-2.929A10 10 0 0022 12a10 10 0 00-2.929-7.071A10 10 0 0012 2z"
              />
            </svg>
            <span>{t('location.current')}</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
