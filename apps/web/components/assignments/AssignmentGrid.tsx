import { AssignmentCard, AssignmentCardSkeleton } from './AssignmentCard';
import type { ApiAssignment } from '@/types';

interface AssignmentGridProps {
  assignments: ApiAssignment[];
  loading?: boolean;
}

export function AssignmentGrid({ assignments, loading }: AssignmentGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <AssignmentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment._id} assignment={assignment} />
      ))}
    </div>
  );
}
