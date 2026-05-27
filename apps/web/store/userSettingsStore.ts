import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserSettingsState {
  teacherName: string;
  schoolName: string;
  city: string;
  setTeacherName: (name: string) => void;
  setSchoolName: (name: string) => void;
  setCity: (city: string) => void;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      teacherName: 'John Doe',
      schoolName: 'Delhi Public School',
      city: 'New Delhi',
      setTeacherName: (teacherName) => set({ teacherName }),
      setSchoolName: (schoolName) => set({ schoolName }),
      setCity: (city) => set({ city }),
    }),
    { name: 'veda-user-settings' },
  ),
);
