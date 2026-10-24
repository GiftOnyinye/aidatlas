function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <div className="animate-pulse bg-slate-200 rounded h-5 w-1/2"></div>
      <div className="animate-pulse bg-slate-200 rounded h-4 w-1/3"></div>
      <div className="animate-pulse bg-slate-200 rounded h-4 w-full"></div>
      <div className="animate-pulse bg-slate-200 rounded h-4 w-4/5"></div>
      <div className="animate-pulse bg-slate-200 rounded h-9 w-full mt-3"></div>
    </div>
  );
}

export default function SkeletonGrid({ count }) {
  const n = count || 6;
  const items = [];
  for (let i = 0; i < n; i++) {
    items.push(<CardSkeleton key={i} />);
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items}
    </div>
  );
}