export function SkeletonLine({ className = '' }) {
  return <div className={`h-4 bg-gray-200 rounded-lg animate-pulse ${className}`} />;
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
      <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded animate-pulse flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-4 py-4 flex gap-4 border-b border-gray-50">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className={`h-4 bg-gray-100 rounded animate-pulse flex-1 ${c === 0 ? 'max-w-[180px]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
