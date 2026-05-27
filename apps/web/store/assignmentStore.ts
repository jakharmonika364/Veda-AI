import { create } from 'zustand';
import api from '@/lib/api';
import type { ApiAssignment } from '@/types';

interface AssignmentState {
  assignments: ApiAssignment[];
  loading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  setAssignments: (assignments: ApiAssignment[]) => void;
  updateAssignmentStatus: (id: string, status: ApiAssignment['status']) => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  loading: false,
  error: null,

  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<ApiAssignment[]>('/api/assignments');
      set({ assignments: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  deleteAssignment: async (id: string) => {
    // Optimistic update
    const prev = get().assignments;
    set({ assignments: prev.filter((a) => a._id !== id) });
    try {
      await api.delete(`/api/assignments/${id}`);
    } catch (err) {
      set({ assignments: prev, error: (err as Error).message });
      throw err;
    }
  },

  setAssignments: (assignments) => set({ assignments }),

  updateAssignmentStatus: (id, status) => {
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a._id === id ? { ...a, status } : a,
      ),
    }));
  },
}));
