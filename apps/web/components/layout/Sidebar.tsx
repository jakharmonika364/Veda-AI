'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useUserSettingsStore } from '@/store/userSettingsStore';

const navItems = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'My Groups', href: '/groups', icon: GroupsIcon },
  { label: 'Assignments', href: '/assignments', icon: AssignmentsIcon, countable: true },
  { label: "AI Teacher's Toolkit", href: '/toolkit', icon: ToolkitIcon },
  { label: 'My Library', href: '/library', icon: LibraryIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const assignments = useAssignmentStore((s) => s.assignments);
  const completedCount = assignments.length;
  const teacherName = useUserSettingsStore((s) => s.teacherName);
  const city = useUserSettingsStore((s) => s.city);
  const initials = teacherName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <aside className="hidden lg:flex flex-col w-sidebar h-screen sticky top-0 flex-shrink-0 p-4">
      <div className="flex flex-1 flex-col rounded-[16px] bg-white shadow-sidebar overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5623]">
            <span className="text-white font-bold text-lg leading-none">V</span>
          </div>
          <span className="font-bold text-lg text-[#303030] tracking-tight">VedaAI</span>
        </div>

        {/* Create Assignment CTA */}
        <div className="px-4 pb-4">
          <Link
            href="/create"
            className="flex w-full items-center justify-center gap-2 rounded-[100px] px-4 py-3 text-sm font-semibold text-white bg-[#272727] border-4 border-[#ff7950] transition-all duration-150 hover:bg-[#181818] hover:shadow-orange-glow"
          >
            <SparkleIcon className="h-4 w-4 text-[#FF7950]" />
            Create Assignment
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#f5f5f5] text-[#303030]'
                    : 'text-[#5E5E5E] hover:bg-[#f9f9f9] hover:text-[#303030]',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.countable && completedCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-[100px] bg-[#FF5623] px-1.5 text-xs font-semibold text-white">
                    {completedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 space-y-0.5 border-t border-[rgba(0,0,0,0.08)]">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#5E5E5E] hover:bg-[#f9f9f9] hover:text-[#303030] transition-colors"
          >
            <SettingsIcon className="h-5 w-5" />
            Settings
          </Link>

          {/* School card */}
          <Link href="/settings" className="mt-2 flex items-center gap-3 rounded-xl bg-[#f5f5f5] px-3 py-3 hover:bg-[#eeeeee] transition-colors">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FF5623]/10 text-[#FF5623] font-semibold text-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#303030]">{teacherName}</p>
              <p className="truncate text-xs text-[#5E5E5E]">{city}</p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function GroupsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AssignmentsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4" />
    </svg>
  );
}

function ToolkitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
    </svg>
  );
}
