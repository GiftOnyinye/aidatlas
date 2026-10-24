import { Calendar } from 'lucide-react';
import Badge from './Badge.jsx';
import { getDeadlineStatus, formatDate } from '../utils/deadlines.js';

export default function DeadlineCard({ item }) {
  const s = getDeadlineStatus(item.date);
  const toneMap = {
    green: 'green',
    amber: 'amber',
    red: 'red',
    gray: 'gray'
  };
  const tone = toneMap[s.urgency] || 'gray';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
        <Calendar size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 truncate">{item.title}</div>
        <div className="text-xs text-slate-500">{item.type}</div>
        <div className="text-sm text-slate-700 mt-1">{formatDate(item.date)}</div>
      </div>
      <Badge tone={tone}>{s.label}</Badge>
    </div>
  );
}