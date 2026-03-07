export default function StatusDonut({ bills }) {
  const total = bills.length || 1;
  const approved = bills.filter(b => b.status === 'Approved').length;
  const pending = bills.filter(b => b.status === 'Pending').length;
  const rejected = bills.filter(b => b.status === 'Rejected').length;

  const segments = [
    { count: approved, color: '#059669', label: 'Validées' },
    { count: pending, color: '#d97706', label: 'En attente' },
    { count: rejected, color: '#dc2626', label: 'Rejetées' },
  ];

  // Build SVG donut
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Répartition par statut</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {segments.map((seg, i) => {
              const dashLength = (seg.count / total) * circumference;
              const dashOffset = -offset;
              offset += dashLength;
              return (
                <circle
                  key={i}
                  cx="50" cy="50" r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500"
                />
              );
            })}
            {bills.length === 0 && (
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-900">{bills.length}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-sm text-gray-600">{seg.label}</span>
              <span className="text-sm font-medium text-gray-900 ml-auto">{seg.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
