import { useEffect } from 'react';
import { useSession, useLanguage } from '../../context';
import { formatDistanceToNow } from '../../utils/date';

export function Sidebar() {
  const {
    sessions,
    activeSession,
    createSession,
    switchSession,
    deleteSession,
    isSidebarOpen,
    setSidebarOpen,
  } = useSession();
  const { t } = useLanguage();

  // Handle resize - collapse on mobile, expand on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 h-full
          flex flex-col
          bg-neutral-50 dark:bg-neutral-950
          border-r border-neutral-200 dark:border-neutral-800
          transition-all duration-300 ease-out
          ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-16'}
          ${!isSidebarOpen && 'max-lg:-translate-x-full'}
        `}
      >
        {/* Full Sidebar Content */}
        <div className={`w-64 h-full flex-col ${isSidebarOpen ? 'flex' : 'hidden'}`}>
          {/* Header */}
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => createSession()}
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-2.5 rounded-lg
                bg-neutral-900 hover:bg-neutral-800
                dark:bg-neutral-100 dark:hover:bg-neutral-200
                text-white dark:text-neutral-900
                text-sm font-medium
                transition-colors duration-150
                shadow-sm
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t('chat.newChat')}
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={activeSession?.id === session.id}
                onClick={() => {
                  switchSession(session.id);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-xs text-neutral-500 text-center">
              {sessions.length} {sessions.length === 1 ? t('chat.count.singular') : t('chat.count.plural')}
            </p>
          </div>

          {/* Collapse button - vertically centered on right edge */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="
              hidden lg:flex
              absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
              items-center justify-center
              w-6 h-6 rounded-full
              bg-white dark:bg-neutral-900
              border border-neutral-200 dark:border-neutral-700
              text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300
              hover:bg-neutral-50 dark:hover:bg-neutral-800
              shadow-sm
              transition-all duration-150
              z-10
            "
            title={t('sidebar.collapse')}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Mini Sidebar Content (collapsed state) */}
        <div className={`w-16 h-full flex-col ${!isSidebarOpen ? 'hidden lg:flex' : 'hidden'}`}>
          {/* New Chat Button */}
          <div className="p-2">
            <button
              onClick={() => createSession()}
              className="
                w-full aspect-square flex items-center justify-center
                rounded-lg
                bg-neutral-900 hover:bg-neutral-800
                dark:bg-neutral-100 dark:hover:bg-neutral-200
                text-white dark:text-neutral-900
                transition-colors duration-150
                shadow-sm
              "
              title={t('chat.newChat')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Expand button - vertically centered on right edge */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="
              absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
              flex items-center justify-center
              w-6 h-6 rounded-full
              bg-white dark:bg-neutral-900
              border border-neutral-200 dark:border-neutral-700
              text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300
              hover:bg-neutral-50 dark:hover:bg-neutral-800
              shadow-sm
              transition-all duration-150
              z-10
            "
            title={t('sidebar.expand')}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}

// Full session item
interface SessionItemProps {
  session: {
    id: string;
    title: string;
    updatedAt: number;
    messages: { role: string }[];
  };
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

function SessionItem({ session, isActive, onClick, onDelete }: SessionItemProps) {
  const { t } = useLanguage();
  
  return (
    <button
      onClick={onClick}
      className={`
        group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        text-left transition-colors duration-150
        ${isActive
          ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100'
          : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300'
        }
      `}
    >
      {/* Chat icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{session.title}</p>
        <p className="text-xs text-neutral-500">
          {formatDistanceToNow(session.updatedAt)}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="
          opacity-0 group-hover:opacity-100
          p-1 rounded
          hover:bg-red-50 dark:hover:bg-red-900/20
          text-neutral-400 hover:text-red-600 dark:hover:text-red-400
          transition-all duration-150
        "
        title={t('chat.deleteSession')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </button>
  );
}
