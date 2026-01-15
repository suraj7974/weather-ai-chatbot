import { useState, useEffect, useRef } from 'react';
import type { LocationData } from '../../types';
import { useLanguage, useChat } from '../../context';
import { locationApi } from '../../services/api';

export function LocationSearch() {
  const { t } = useLanguage();
  const { location, setLocation } = useChat();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
        // If user clicks outside while changing, cancel the change mode
        if (isChanging && location) {
          setIsChanging(false);
          setQuery('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChanging, location]);

  // Focus input when entering change mode
  useEffect(() => {
    if (isChanging && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChanging]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await locationApi.search(query);
        setResults(data);
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc: LocationData) => {
    setLocation(loc);
    setQuery('');
    setResults([]);
    setShowResults(false);
    setIsChanging(false);
  };

  const handleChangeClick = () => {
    setIsChanging(true);
    setQuery('');
  };

  const handleCancelChange = () => {
    setIsChanging(false);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Current location display - show when location exists and not changing */}
      {location && !isChanging ? (
        <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-900 rounded-lg px-3 py-2.5 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <svg
              className="w-4 h-4 text-neutral-500 flex-shrink-0"
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
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {location.name}
              </p>
              {(location.state || location.country) && (
                <p className="text-xs text-neutral-500 truncate">
                  {location.state && `${location.state}, `}
                  {location.country}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleChangeClick}
            className="
              px-2.5 py-1 rounded-md flex-shrink-0
              text-xs font-medium
              text-neutral-600 dark:text-neutral-400
              hover:bg-neutral-200 dark:hover:bg-neutral-800
              transition-colors duration-150
            "
          >
            {t('location.change')}
          </button>
        </div>
      ) : (
        // Search input - show when no location or when changing
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder={t('location.search')}
            className="
              w-full px-3 py-2.5 pl-9 text-sm
              rounded-lg
              bg-neutral-100 dark:bg-neutral-900
              border border-neutral-200 dark:border-neutral-800
              focus:border-neutral-400 dark:focus:border-neutral-600
              focus:bg-white dark:focus:bg-neutral-950
              text-neutral-900 dark:text-neutral-100
              placeholder-neutral-500
              outline-none
              transition-all duration-150
            "
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          {isSearching ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : isChanging ? (
            <button
              onClick={handleCancelChange}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              title={t('location.cancel')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      )}

      {/* Search results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden animate-fadeIn">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {results.map((loc, index) => (
              <button
                key={`${loc.lat}-${loc.lon}-${index}`}
                onClick={() => handleSelect(loc)}
                className="
                  w-full px-3 py-2.5 text-left
                  flex items-center gap-2.5
                  hover:bg-neutral-50 dark:hover:bg-neutral-900
                  transition-colors duration-150
                  border-b border-neutral-100 dark:border-neutral-900 last:border-0
                "
              >
                <svg
                  className="w-4 h-4 text-neutral-400 flex-shrink-0"
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
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {loc.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {loc.state && `${loc.state}, `}
                    {loc.country}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
