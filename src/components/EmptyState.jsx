export default function EmptyState({ title, description, action }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-3 text-xl font-semibold">
        ∅
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mt-1 max-w-md">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}