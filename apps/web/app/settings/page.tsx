'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TopBar } from '@/components/layout/TopBar';
import { useUserSettingsStore } from '@/store/userSettingsStore';

export default function SettingsPage() {
  const teacherName = useUserSettingsStore((s) => s.teacherName);
  const schoolName = useUserSettingsStore((s) => s.schoolName);
  const city = useUserSettingsStore((s) => s.city);
  const setTeacherName = useUserSettingsStore((s) => s.setTeacherName);
  const setSchoolName = useUserSettingsStore((s) => s.setSchoolName);
  const setCity = useUserSettingsStore((s) => s.setCity);

  const [localTeacherName, setLocalTeacherName] = useState(teacherName);
  const [localSchoolName, setLocalSchoolName] = useState(schoolName);
  const [localCity, setLocalCity] = useState(city);

  // Sync once the persist middleware rehydrates from localStorage
  useEffect(() => {
    setLocalTeacherName(teacherName);
    setLocalSchoolName(schoolName);
    setLocalCity(city);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherName, schoolName, city]);

  function handleSave() {
    if (!localTeacherName.trim()) {
      toast.error('Teacher name cannot be empty');
      return;
    }
    if (!localSchoolName.trim()) {
      toast.error('School name cannot be empty');
      return;
    }
    setTeacherName(localTeacherName.trim());
    setSchoolName(localSchoolName.trim());
    setCity(localCity.trim());
    toast.success('Settings saved');
  }

  return (
    <>
      <TopBar title="Settings" showBack />
      <main className="flex flex-1 flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-lg space-y-6">
          {/* Profile section */}
          <div className="rounded-[24px] bg-white p-6 shadow-card space-y-5">
            <div>
              <h2 className="text-base font-bold text-text-primary">Profile</h2>
              <p className="mt-0.5 text-sm text-text-secondary">
                This information appears in the sidebar and on exported PDFs.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary" htmlFor="teacher-name">
                  Your Name
                </label>
                <input
                  id="teacher-name"
                  type="text"
                  value={localTeacherName}
                  onChange={(e) => setLocalTeacherName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-full border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] px-4 py-2.5 text-sm text-[#303030] placeholder-[#9e9e9e] focus:border-[#FF5623] focus:outline-none focus:ring-1 focus:ring-[#FF5623]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary" htmlFor="school-name">
                  School Name
                </label>
                <input
                  id="school-name"
                  type="text"
                  value={localSchoolName}
                  onChange={(e) => setLocalSchoolName(e.target.value)}
                  placeholder="e.g. Delhi Public School"
                  className="w-full rounded-full border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] px-4 py-2.5 text-sm text-[#303030] placeholder-[#9e9e9e] focus:border-[#FF5623] focus:outline-none focus:ring-1 focus:ring-[#FF5623]"
                />
                <p className="text-xs text-text-secondary px-1">
                  Used as the school name on generated question papers.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-primary" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={localCity}
                  onChange={(e) => setLocalCity(e.target.value)}
                  placeholder="e.g. New Delhi"
                  className="w-full rounded-full border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] px-4 py-2.5 text-sm text-[#303030] placeholder-[#9e9e9e] focus:border-[#FF5623] focus:outline-none focus:ring-1 focus:ring-[#FF5623]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSave}
                className="rounded-full bg-[#272727] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#181818] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Preview card */}
          <div className="rounded-[24px] bg-white p-6 shadow-card space-y-3">
            <h2 className="text-base font-bold text-text-primary">Preview</h2>
            <div className="flex items-center gap-3 rounded-xl bg-[#f5f5f5] px-3 py-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FF5623]/10 text-[#FF5623] font-semibold text-sm">
                {localTeacherName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#303030]">
                  {localTeacherName || 'Your Name'}
                </p>
                <p className="truncate text-xs text-[#5E5E5E]">
                  {localCity || 'City'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
