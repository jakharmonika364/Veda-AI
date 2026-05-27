import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      {/* Illustration */}
      <div className="mb-8 flex h-40 w-40 items-center justify-center">
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Document */}
          <rect x="40" y="20" width="80" height="100" rx="12" fill="#f5f5f5" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
          <rect x="55" y="40" width="50" height="4" rx="2" fill="rgba(0,0,0,0.1)" />
          <rect x="55" y="52" width="40" height="4" rx="2" fill="rgba(0,0,0,0.08)" />
          <rect x="55" y="64" width="45" height="4" rx="2" fill="rgba(0,0,0,0.1)" />
          <rect x="55" y="76" width="35" height="4" rx="2" fill="rgba(0,0,0,0.08)" />
          {/* Magnifying glass */}
          <circle cx="100" cy="95" r="26" fill="white" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
          <circle cx="100" cy="95" r="16" fill="#f9f9f9" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
          <line x1="111" y1="106" x2="124" y2="119" stroke="rgba(0,0,0,0.2)" strokeWidth="3" strokeLinecap="round" />
          {/* X mark */}
          <line x1="93" y1="88" x2="107" y2="102" stroke="#FF5623" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="107" y1="88" x2="93" y2="102" stroke="#FF5623" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-[#303030] tracking-tight">No assignments yet</h2>
      <p className="mt-2 max-w-sm text-sm text-[#5E5E5E]">
        Create your first AI-powered question paper in minutes. Upload a document or describe what you need.
      </p>

      <Link href="/create" className="mt-8">
        <Button size="lg">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Assignment
        </Button>
      </Link>
    </div>
  );
}
