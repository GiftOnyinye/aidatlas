import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { universities } from '../data/universities.js';
import { useApp } from '../context/AppContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatDate } from '../utils/deadlines.js';

const STATUSES = [
  'researching',
  'shortlisted',
  'preparing',
  'submitted',
  'awaiting',
  'accepted',
  'waitlisted',
  'rejected'
];

const STATUS_LABELS = {
  researching: 'Researching',
  shortlisted: 'Shortlisted',
  preparing: 'Preparing',
  submitted: 'Submitted',
  awaiting: 'Awaiting Decision',
  accepted: 'Accepted',
  waitlisted: 'Waitlisted',
  rejected: 'Rejected'
};

export default function ApplicationTracker() {
  const { savedUnis, applications, updateApplication } = useApp();

  const unis = savedUnis
    .map(function (id) {
      return universities.find(function (u) { return u.id === id; });
    })
    .filter(Boolean);

  if (unis.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Application Tracker</h1>
        <EmptyState
          title="No applications yet"
          description="Save universities first, then track application progress here."
          action={
            <Link
              to="/explore"
              className="rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
            >
              Explore Universities
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Application Tracker</h1>
        <p className="text-slate-500 text-sm mt-1">
          Track the status of every university you are applying to.
        </p>
      </div>

      <div className="space-y-4">
        {unis.map(function (u) {
          const a = applications[u.id] || {};
          const deadline = u.deadlines && u.deadlines.regularDecision
            ? formatDate(u.deadlines.regularDecision)
            : 'Not yet published for Fall 2027';

          return (
            <div key={u.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <Link
                      to={'/university/' + u.id}
                      className="font-semibold text-slate-900 hover:text-blue-700"
                    >
                      {u.name}
                    </Link>
                    <div className="text-xs text-slate-500">Deadline: {deadline}</div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">
                    Application status
                  </label>
                  <select
                    value={a.status || 'researching'}
                    onChange={function (e) { updateApplication(u.id, { status: e.target.value }); }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    {STATUSES.map(function (s) {
                      return <option key={s} value={s}>{STATUS_LABELS[s]}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">
                    Financial-aid status
                  </label>
                  <input
                    value={a.financialAidStatus || ''}
                    onChange={function (e) { updateApplication(u.id, { financialAidStatus: e.target.value }); }}
                    placeholder="e.g. CSS Profile submitted"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">
                    Notes
                  </label>
                  <textarea
                    value={a.notes || ''}
                    onChange={function (e) { updateApplication(u.id, { notes: e.target.value }); }}
                    rows={2}
                    placeholder="Essays drafted, recommenders contacted…"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 mt-6">
        Application progress is saved locally in your browser (localStorage). It is not sent to any server.
      </p>
    </div>
  );
}