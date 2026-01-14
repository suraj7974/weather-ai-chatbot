import { useTheme, useLanguage, useSession } from '../../context';
import { LanguageSelector } from '../voice';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { toggleSidebar } = useSession();

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {/* Menu button */}
          <button
            onClick={toggleSidebar}
            className="
              lg:hidden
              p-2 rounded-lg
              hover:bg-zinc-100 dark:hover:bg-zinc-800
              text-zinc-600 dark:text-zinc-400
              transition-colors duration-150
            "
            title="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {t('app.title')}
              </h1>
              <p className="text-xs text-zinc-500 hidden sm:block">
                {t('app.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Language selector */}
          <LanguageSelector compact />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="
              p-2 rounded-lg
              hover:bg-zinc-100 dark:hover:bg-zinc-800
              text-zinc-600 dark:text-zinc-400
              transition-colors duration-150
            "
            title={theme === 'light' ? t('theme.dark') : t('theme.light')}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
