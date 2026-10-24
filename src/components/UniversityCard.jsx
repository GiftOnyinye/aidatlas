import { Link } from 'react-router-dom';
import { Bookmark, GitCompare, MapPin, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { calculateAidAtlasMatch, matchLabel } from '../utils/matching.js';

export default function UniversityCard({ u }) {
  const { savedUnis, toggleSaveUni, compareList, addToCompare, profile } = useApp();
  const saved = savedUnis.indexOf(u.id) !== -1;
  const inCompare = compareList.indexOf(u.id) !== -1;
  const match = calculateAidAtlasMatch(u, profile);
  const label = matchLabel(match.score);

  const initials = u.name
    .split(' ')
    .filter(function (w) { return /[A-Z]/.test(w[0]); })
    .slice(0, 2)
    .map(function (w) { return w[0]; })
    .join('');

  const badges = [];
  if (['available', 'limited'].includes(u.internationalAid)) badges.push({ text: 'International Aid', tone: 'teal' });
  if (u.needBasedAid === 'available') badges.push({ text: 'Need-Based', tone: 'clay' });
  if (['possible', 'available'].includes(u.fullRide)) badges.push({ text: 'Full-Ride', tone: 'teal' });
  if (u.needBlindInternational === true) badges.push({ text: 'Need-Blind', tone: 'clay' });

  const costDisplay = u.costs && u.costs.totalEstimated
    ? u.costs.currency + ' ' + u.costs.totalEstimated.toLocaleString()
    : 'Not yet verified';

  const deadlineDisplay = u.deadlines && u.deadlines.regularDecision
    ? u.deadlines.regularDecision
    : 'Not yet published';

  return (
    <article className="card card-hover flex flex-col p-0 overflow-hidden group">
      {/* Top accent based on match score */}
      <div className={'h-1.5 ' + (match.score >= 65 ? 'bg-teal-500' : match.score >= 50 ? 'bg-clay-400' : 'bg-muted')}></div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-btn bg-sand text-slate font-serif font-bold text-lg flex items-center justify-center shrink-0 border border-line">
            {initials}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <Link to={'/university/' + u.id} className="font-serif text-lg text-slate hover:text-clay-600 transition-colors line-clamp-2">
              {u.name}
            </Link>
            <div className="text-xs text-muted flex items-center gap-1 mt-1 font-medium">
              <MapPin size={12} /> {u.city}, {u.country}
            </div>
          </div>
          <button
            onClick={function () { toggleSaveUni(u.id); }}
            aria-label={saved ? 'Remove from saved' : 'Save'}
            className={'p-1.5 rounded-full transition-colors shrink-0 ' + (saved ? 'text-clay-500 bg-clay-50' : 'text-muted hover:text-slate hover:bg-sand')}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="text-sm text-muted line-clamp-2 mb-4">{u.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {badges.map(function (b, i) {
            return <span key={i} className={'badge-' + b.tone}>{b.text}</span>;
          })}
        </div>

        <dl className="grid grid-cols-2 gap-3 pt-4 border-t border-line mb-5 mt-auto">
          <div>
            <dt className="label">Est. cost</dt>
            <dd className="text-sm font-semibold text-slate">{costDisplay}</dd>
          </div>
          <div>
            <dt className="label flex items-center gap-1"><Calendar size={11} /> Deadline</dt>
            <dd className="text-sm font-semibold text-slate truncate">{deadlineDisplay}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={'text-sm font-bold px-2.5 py-1 rounded-btn ' + (match.score >= 65 ? 'bg-teal-50 text-teal-700' : match.score >= 50 ? 'bg-clay-50 text-clay-700' : 'bg-sand text-muted')}>
              {match.score}% Match
            </div>
            <span className="text-xs font-semibold text-muted hidden sm:inline">{label.label}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={'/university/' + u.id} className="btn-primary flex-1 py-2 text-xs">
            View Details
          </Link>
          <button
            onClick={function () { addToCompare(u.id); }}
            disabled={inCompare}
            className="btn-secondary px-3 py-2"
            aria-label="Compare"
          >
            <GitCompare size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}