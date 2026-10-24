export default function Badge({ children, tone }) {
  const t = tone || 'gray';
  const classes = {
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200'
  };
  const cls = classes[t] || classes.gray;
  return (
    <span className={'inline-flex items-center gap-1 rounded-full text-xs font-medium px-2 py-0.5 border ' + cls}>
      {children}
    </span>
  );
}