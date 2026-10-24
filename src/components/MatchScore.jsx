import { matchLabel } from '../utils/matching.js';

export default function MatchScore({ score, size }) {
  if (score === null || score === undefined) return null;

  const label = matchLabel(score);
  const sz = size || 'md';

  const dim = sz === 'lg' ? 'w-16 h-16 text-base' : 'w-12 h-12 text-sm';

  const toneColors = {
    green: 'bg-emerald-600',
    blue: 'bg-blue-700',
    amber: 'bg-amber-500',
    gray: 'bg-slate-500',
    red: 'bg-red-600'
  };
  const bg = toneColors[label.tone] || toneColors.gray;

  return (
    <div className="flex items-center gap-2">
      <div className={dim + ' ' + bg + ' rounded-full text-white flex items-center justify-center font-semibold shrink-0'}>
        {score}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-slate-500 uppercase tracking-wide">AidAtlas Match</div>
        <div className="text-sm font-semibold text-slate-800">{label.label}</div>
      </div>
    </div>
  );
}