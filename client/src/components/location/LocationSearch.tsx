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
        <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <svg
              className="w-4 h-4 text-indigo-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">
                {location.name}
              </p>
              {(location.state || location.country) && (
                <p className="text-xs text-zinc-500 truncate">
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
              text-indigo-600 dark:text-indigo-400
              hover:bg-indigo-50 dark:hover:bg-indigo-950/50
              transition-colors duration-150
            "
          >
            Change
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
              bg-zinc-100 dark:bg-zinc-800
              border border-transparent
              focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900
              text-zinc-900 dark:text-zinc-100
              placeholder-zinc-500
              outline-none
              focus:ring-2 focus:ring-indigo-500/20
              transition-all duration-150
            "
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {isSearching ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : isChanging ? (
            <button
              onClick={handleCancelChange}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              title="Cancel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      )}

      {/* Search results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-lg overflow-hidden animate-fadeIn">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {results.map((loc, index) => (
              <button
                key={`${loc.lat}-${loc.lon}-${index}`}
                onClick={() => handleSelect(loc)}
                className="
                  w-full px-3 py-2.5 text-left
                  flex items-center gap-2.5
                  hover:bg-zinc-50 dark:hover:bg-zinc-800
                  transition-colors duration-150
                  border-b border-zinc-100 dark:border-zinc-800 last:border-0
                "
              >
                <svg
                  className="w-4 h-4 text-zinc-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">
                    {loc.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
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
