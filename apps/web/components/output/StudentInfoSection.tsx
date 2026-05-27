export function StudentInfoSection() {
  return (
    <div className="space-y-2 py-2">
      <div className="flex flex-wrap gap-x-10 gap-y-2">
        <InfoLine label="Name" width="w-48" />
        <InfoLine label="Roll Number" width="w-32" />
      </div>
      <InfoLine label="Class & Section" width="w-40" />
    </div>
  );
}

function InfoLine({ label, width }: { label: string; width: string }) {
  return (
    <p className="text-sm text-[#303030]">
      <span className="font-medium">{label}:</span>{' '}
      <span className={`inline-block border-b border-[#303030] ${width}`}>&nbsp;</span>
    </p>
  );
}
