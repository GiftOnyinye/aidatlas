import { Link } from 'react-router-dom';
import { Bookmark, Calendar, Award } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getDeadlineStatus, formatDate } from '../utils/deadlines.js';

export default function ScholarshipCard({ s }) {
  const { savedScholarships, toggleSaveScholarship } = useApp();
  const saved = savedScholarships.indexOf(s.id) !== -1;
  const status = getDeadlineStatus(s.deadline);

  const toneMap = { open: 'teal', 'closing-soon': 'clay', closed: 'gray', unknown: 'gray' };
  const tone = toneMap[status.status] || 'gray';

  return (
    <article className="card card-hover flex flex-col p-0 overflow-hidden">
      <div className={'h-1.5 ' + (tone === 'clay' ? 'bg-clay-500' : tone === 'teal' ? 'bg-teal-500' : 'bg-line')}></div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <Link to={'/scholarship/' + s.id} className="font-serif text-lg text-slate hover:text-clay-600 transition-colors line-clamp-2">
              {s.name}
            </Link>
            <div className="text-xs text-muted font-medium mt-1">{s.provider}</div>
          </div>
          <button
            onClick={function () { toggleSaveScholarship(s.id); }}
            aria-label={saved ? 'Remove from saved' : 'Save'}
            className={'p-1.5 rounded-full transition-colors shrink-0 ' + (saved ? 'text-clay-500 bg-clay-50' : 'text-muted hover:text-slate hover:bg-sand')}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={'badge-' + tone}>{status.label}</span>
          <span className="badge-gray">{s.fundingType}</span>
          {s.country && <span className="badge-gray">{s.country}</span>}
        </div>

        <div className="text-sm text-slate flex items-start gap-2 mb-3">
          <Award size={16} className="mt-0.5 shrink-0 text-muted" />
          <span className="line-clamp-2">{s.award || 'Award amount not published'}</span>
        </div>

        <div className="text-sm text-muted flex items-center gap-2 mb-5 mt-auto">
          <Calendar size={15} className="shrink-0" />
          {formatDate(s.deadline)}
        </div>

        <div className="flex gap-2 pt-4 border-t border-line">
          <Link to={'/scholarship/' + s.id} className="btn-secondary flex-1 py-2 text-xs">
            View Details
          </Link>
          <a href={s.applicationURL} target="_blank" rel="noopener noreferrer" className="btn-primary py-2 text-xs">
            Apply
          </a>
        </div>
      </div>
    </article>
  );
}