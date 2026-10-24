import { calculateAidAtlasMatch } from '../utils/matching.js';

const CATEGORIES = [
  { key: 'academicFit', label: 'Academic fit', max: 25 },
  { key: 'financialFit', label: 'Financial fit', max: 30 },
  { key: 'internationalFit', label: 'International fit', max: 20 },
  { key: 'majorFit', label: 'Major fit', max: 15 },
  { key: 'applicationFit', label: 'Application fit', max: 10 },
  { key: 'preferencesFit', label: 'Preferences fit', max: 10 }
];

function barColor(ratio) {
  if (ratio >= 0.8) return 'bg-emerald-500';
  if (ratio >= 0.6) return 'bg-blue-600';
  if (ratio >= 0.4) return 'bg-amber-500';
  return 'bg-slate-400';
}

export default function MatchChart({ university, profile, match }) {
  const m = match || calculateAidAtlasMatch(university, profile);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Match breakdown</h3>
        <span className="text-2xl font-bold text-slate-900">{m.score} / 100</span>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map(function (cat) {
          const value = m[cat.key] || 0;
          const ratio = value / cat.max;
          const pct = Math.round(ratio * 100);
          return (
            <div key={cat.key}>
              <div className="flex items-baseline justify-between mb-1 text-sm">
                <span className="text-slate-700">{cat.label}</span>
                <span className="text-slate-500 text-xs font-medium">
                  {value} / {cat.max}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={'h-full transition-all ' + barColor(ratio)}
                  style={{ width: pct + '%' }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
        Each category contributes a maximum of its listed points. The score is the sum,
        normalized to 100. This is a planning tool, not an admission prediction.
      </div>
    </div>
  );
}