'use client';

import { useRouter } from 'next/navigation';
import { useUserSettingsStore } from '@/store/userSettingsStore';

interface TopBarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showGreenDot?: boolean;
}

export function TopBar({ title, subtitle, showBack, showGreenDot }: TopBarProps) {
  const router = useRouter();
  const teacherName = useUserSettingsStore((s) => s.teacherName);
  const initials = teacherName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <header className="sticky top-4 z-30 mx-4 mt-4 mb-2 flex h-[56px] items-center justify-between rounded-[16px] bg-[rgba(255,255,255,0.75)] backdrop-blur-md px-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <svg className="h-4 w-4 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2 min-w-0">
          <svg className="h-4 w-4 text-[#5E5E5E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {showGreenDot && (
                <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
              )}
              <h1 className="text-sm font-semibold text-[#303030] truncate tracking-tight">{title}</h1>
            </div>
            {subtitle && (
              <p className="text-xs text-[#5E5E5E] truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Bell */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          aria-label="Notifications"
        >
          <svg className="h-5 w-5 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#FF5623]" />
        </button>

        {/* User */}
        <a href="/settings" className="flex items-center gap-2 rounded-[100px] px-2 py-1 hover:bg-black/5 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF5623]/10 text-[#FF5623] text-xs font-semibold">
            {initials}
          </div>
          <span className="hidden sm:block text-sm font-medium text-[#303030]">{teacherName}</span>
          <svg className="h-3 w-3 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </header>
  );
}
