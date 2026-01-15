import { useTheme, useLanguage, useSession } from '../../context';
import { LanguageSelector } from '../voice';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { toggleSidebar } = useSession();

  return (
    <header className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {/* Menu button */}
          <button
            onClick={toggleSidebar}
            className="
              lg:hidden
              p-2 rounded-md
              hover:bg-neutral-100 dark:hover:bg-neutral-900
              text-neutral-600 dark:text-neutral-400
              transition-colors duration-150
            "
            title={t('sidebar.toggle')}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo and title */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100">
              <svg
                className="w-5 h-5 text-white dark:text-neutral-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {t('app.title')}
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 hidden sm:block">
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
              p-2 rounded-md
              hover:bg-neutral-100 dark:hover:bg-neutral-900
              text-neutral-600 dark:text-neutral-400
              transition-colors duration-150
            "
            title={theme === 'light' ? t('theme.dark') : t('theme.light')}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
