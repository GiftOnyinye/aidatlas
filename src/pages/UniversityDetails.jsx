import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ExternalLink, Bookmark, GitCompare, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { universities } from '../data/universities.js';
import { scholarships } from '../data/scholarships.js';
import { useApp } from '../context/AppContext.jsx';
import Badge from '../components/Badge.jsx';
import MatchScore from '../components/MatchScore.jsx';
import MatchChart from '../components/MatchChart.jsx';
import { calculateAidAtlasMatch, matchLabel } from '../utils/matching.js';
import { formatDate } from '../utils/deadlines.js';
import ScholarshipCard from '../components/ScholarshipCard.jsx';

const TABS = ['Overview', 'Academics', 'Admission', 'Financial Aid', 'Scholarships', 'Deadlines', 'International Students'];

const DEFAULT_CHECKLIST_ITEMS = [
  'Common Application',
  'Personal essay',
  'School transcript',
  'Recommendation letter',
  'Counselor recommendation',
  'School report',
  'SAT / ACT scores',
  'TOEFL / IELTS / Duolingo',
  'CSS Profile',
  'Financial certification',
  'Passport / identity document'
];

const CHECKLIST_STATUSES = ['Not started', 'In progress', 'Complete'];

function Field({ label, value }) {
  const shown = value === null || value === undefined || value === '' ? 'Data unavailable' : value;
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm text-slate-800">{shown}</div>
    </div>
  );
}

function AidRow({ label, value }) {
  let tone = 'gray';
  if (value === 'available') tone = 'green';
  else if (value === 'possible' || value === 'limited') tone = 'amber';

  let text = 'Data unavailable';
  if (value === 'available') text = 'Available';
  else if (value === 'limited') text = 'Limited';
  else if (value === 'possible') text = 'Possible';
  else if (value === 'unavailable') text = 'Unavailable';
  else if (value) text = value;

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg">
      <span className="text-sm text-slate-700">{label}</span>
      <Badge tone={tone}>{text}</Badge>
    </div>
  );
}

function Checklist({ universityId }) {
  const { checklist, updateChecklistItem } = useApp();
  const state = checklist[universityId] || {};

  return (
    <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
      {DEFAULT_CHECKLIST_ITEMS.map(function (item) {
        const s = state[item] || 'Not started';
        return (
          <li key={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5">
            <span className="text-sm text-slate-800">{item}</span>
            <div className="flex gap-1 flex-wrap" role="group" aria-label={item + ' status'}>
              {CHECKLIST_STATUSES.map(function (st) {
                const active = s === st;
                return (
                  <button
                    key={st}
                    onClick={function () { updateChecklistItem(universityId, item, st); }}
                    className={
                      'text-xs px-2 py-1 rounded-md border ' +
                      (active
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')
                    }
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function UniversityDetails() {
  const { id } = useParams();
  const u = universities.find(function (x) { return x.id === id; });
  const [tab, setTab] = useState('Overview');
  const { savedUnis, toggleSaveUni, compareList, addToCompare, profile } = useApp();

  if (!u) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold">University not found</h1>
        <Link to="/explore" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium">
          Back to Explore
        </Link>
      </div>
    );
  }

  const match = calculateAidAtlasMatch(u, profile);
  const mLabel = matchLabel(match.score);
  const saved = savedUnis.indexOf(u.id) !== -1;
  const inCompare = compareList.indexOf(u.id) !== -1;
  const relSch = scholarships.filter(function (s) {
    return s.universityId === u.id || s.university === u.name || s.country === u.country;
  }).slice(0, 5);

  const initials = u.name
    .split(' ')
    .filter(function (w) { return /[A-Z]/.test(w[0]); })
    .slice(0, 2)
    .map(function (w) { return w[0]; })
    .join('');

  const rdDeadline = u.deadlines && u.deadlines.regularDecision
    ? formatDate(u.deadlines.regularDecision)
    : 'Not yet published for Fall 2027';

  const finDeadline = u.deadlines && u.deadlines.financialAid
    ? u.deadlines.financialAid
    : 'Not yet published for Fall 2027';

  const costRow = u.costs && u.costs.totalEstimated
    ? u.costs.currency + ' ' + u.costs.totalEstimated.toLocaleString()
    : 'Not yet verified';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-16 h-16 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-900">{u.name}</h1>
            <div className="text-slate-500 mt-1">
              {u.city}, {u.country} · {u.type}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <a
                href={u.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                <ExternalLink size={16} /> Official Website
              </a>
              <button
                onClick={function () { toggleSaveUni(u.id); }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={function () { addToCompare(u.id); }}
                disabled={inCompare}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60"
              >
                <GitCompare size={16} /> {inCompare ? 'In compare' : 'Add to Compare'}
              </button>
            </div>
          </div>
          <div className="shrink-0">
            <MatchScore score={match.score} size="lg" />
          </div>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
        <h2 className="font-semibold text-slate-900 text-lg mb-4">Is this worth applying to?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-emerald-700 mb-2 flex items-center gap-1">
              <Check size={16} /> Strong fit
            </div>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {match.reasons.slice(0, 6).map(function (r, i) { return <li key={i}>✓ {r}</li>; })}
              {match.reasons.length === 0 && <li className="text-slate-500">Add profile details to see fit reasons.</li>}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-1">
              <AlertTriangle size={16} /> Potential concerns
            </div>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {match.concerns.map(function (r, i) { return <li key={i}>⚠ {r}</li>; })}
              {match.concerns.length === 0 && <li className="text-slate-500">No major concerns detected.</li>}
            </ul>
          </div>
        </div>
                <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
            <div className="text-xs uppercase tracking-wide text-blue-700 font-semibold">AidAtlas Match</div>
            <div className="text-lg font-bold text-slate-900">{match.score} / 100</div>
          </div>
          <div className="text-sm text-slate-800 font-medium mb-2">{mLabel.label}</div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Based on your profile and AidAtlas's matching criteria. This is a planning tool, not an admission prediction.
            Always verify requirements and financial-aid policies with the university.
          </div>
        </div>
      </section>
            <div className="mt-6">
        <MatchChart university={u} profile={profile} match={match} />
      </div>

      <div className="mt-6 border-b border-slate-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max" role="tablist">
          {TABS.map(function (t) {
            const active = tab === t;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                onClick={function () { setTab(t); }}
                className={
                  'px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap ' +
                  (active ? 'text-blue-700 border-blue-700' : 'border-transparent text-slate-600 hover:text-slate-900')
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {tab === 'Overview' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Institution type" value={u.type} />
            <Field label="Location" value={u.city + ', ' + u.country} />
            <Field label="Founded" value={u.founded} />
            <Field label="Undergraduate enrollment" value={u.enrollment} />
            <Field label="Acceptance rate" value={u.acceptanceRate} />
            <Field label="Student-faculty ratio" value={u.studentFacultyRatio} />
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="text-xs text-slate-500">Description</div>
              <div className="text-sm text-slate-800 mt-1">{u.description}</div>
            </div>
          </div>
        )}

        {tab === 'Academics' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <ul className="divide-y divide-slate-100">
              {(u.majors || []).map(function (m) {
                return (
                  <li key={m.name} className="py-3">
                    <div className="font-medium text-slate-900">{m.name}</div>
                    <div className="text-xs text-slate-500">
                      {m.degree} · {m.department}
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-slate-500 mt-4">
              Only programs verified as undergraduate majors are listed. Concentrations within Computer Science
              are not treated as separate majors.
            </p>
          </div>
        )}

        {tab === 'Admission' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 grid sm:grid-cols-2 gap-5">
            <Field label="Application platform" value={u.application && u.application.platform} />
            <Field
              label="Application fee"
              value={
                u.application && u.application.fee !== null && u.application.fee !== undefined
                  ? 'USD ' + u.application.fee
                  : null
              }
            />
            <Field label="Fee waiver" value={u.application && u.application.feeWaiver} />
            <Field label="SAT policy" value={u.testing && u.testing.sat} />
            <Field label="ACT policy" value={u.testing && u.testing.act} />
            <Field label="English test" value={u.testing && u.testing.englishTest} />
            <Field label="TOEFL" value={u.testing && u.testing.toefl} />
            <Field label="IELTS" value={u.testing && u.testing.ielts} />
            <Field label="Duolingo" value={u.testing && u.testing.duolingo} />
          </div>
        )}

        {tab === 'Financial Aid' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Estimated cost</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Tuition" value={u.costs && u.costs.tuition ? 'USD ' + u.costs.tuition.toLocaleString() : null} />
                <Field label="Fees" value={u.costs && u.costs.fees} />
                <Field label="Housing" value={u.costs && u.costs.housing} />
                <Field label="Food" value={u.costs && u.costs.food} />
                <Field label="Books" value={u.costs && u.costs.books} />
                <Field label="Transportation" value={u.costs && u.costs.transportation} />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Field label="Estimated total annual cost" value={costRow} />
                <div className="text-xs text-slate-500 mt-1">
                  {u.costs && u.costs.note ? u.costs.note : ''}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Financial aid</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <AidRow label="Need-based institutional aid" value={u.needBasedAid} />
                <AidRow label="Merit scholarships" value={u.meritAid} />
                <AidRow label="Full-ride possible" value={u.fullRide} />
                <AidRow label="Full-tuition possible" value={u.fullTuition} />
                <AidRow label="International student aid" value={u.internationalAid} />
                <AidRow label="CSS Profile" value={u.cssProfileRequired} />
                <AidRow label="Need-blind for internationals" value={u.needBlindInternational === true ? 'available' : u.needBlindInternational === false ? 'unavailable' : null} />
                <AidRow label="Meets 100% demonstrated need" value={u.meetsFullDemonstratedNeed === true ? 'available' : u.meetsFullDemonstratedNeed === false ? 'unavailable' : null} />
              </div>
              {u.concerns && u.concerns.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-900">
                  {u.concerns.map(function (c, i) { return <div key={i}>⚠ {c}</div>; })}
                </div>
              )}
              <a
                href={(u.sources && u.sources[0] && u.sources[0].url) || u.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
              >
                Verify on official university website <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {tab === 'Scholarships' && (
          <div className="space-y-4">
            {relSch.length > 0 ? (
              relSch.map(function (s) { return <ScholarshipCard key={s.id} s={s} />; })
            ) : (
              <p className="text-slate-500">No linked scholarships or institutional aid records in the dataset for this university.</p>
            )}
          </div>
        )}

        {tab === 'Deadlines' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <ul className="divide-y divide-slate-100">
              <li className="py-3 flex items-center justify-between">
                <span className="text-sm text-slate-700">Early Action</span>
                <span className="text-sm font-medium text-slate-900">
                  {u.deadlines && u.deadlines.earlyAction ? formatDate(u.deadlines.earlyAction) : 'Data unavailable'}
                </span>
              </li>
              <li className="py-3 flex items-center justify-between">
                <span className="text-sm text-slate-700">Early Decision</span>
                <span className="text-sm font-medium text-slate-900">
                  {u.deadlines && u.deadlines.earlyDecision ? u.deadlines.earlyDecision : 'Data unavailable'}
                </span>
              </li>
              <li className="py-3 flex items-center justify-between">
                <span className="text-sm text-slate-700">Regular Decision</span>
                <span className="text-sm font-medium text-slate-900">{rdDeadline}</span>
              </li>
              <li className="py-3 flex items-center justify-between">
                <span className="text-sm text-slate-700">Financial Aid</span>
                <span className="text-sm font-medium text-slate-900">{finDeadline}</span>
              </li>
            </ul>
            {u.deadlines && u.deadlines.note && (
              <p className="text-xs text-slate-500 mt-4 border-t border-slate-100 pt-3">{u.deadlines.note}</p>
            )}
          </div>
        )}

        {tab === 'International Students' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 grid sm:grid-cols-2 gap-5">
            <Field label="International applicants accepted" value={u.internationalStudents ? 'Yes' : 'Unknown'} />
            <Field label="International financial aid" value={u.internationalAid} />
            <Field label="Need-blind for internationals" value={u.needBlindInternational === true ? 'Yes' : u.needBlindInternational === false ? 'No' : 'Unknown'} />
            <Field label="Meets 100% demonstrated need" value={u.meetsFullDemonstratedNeed === true ? 'Yes' : u.meetsFullDemonstratedNeed === false ? 'No' : 'Unknown'} />
            <Field label="English proficiency requirement" value={u.testing && u.testing.englishTest} />
          </div>
        )}
      </div>

      <section className="mt-8">
        <h2 className="font-semibold text-slate-900 text-lg mb-3">Document checklist</h2>
        <Checklist universityId={u.id} />
      </section>

      <section className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <ShieldCheck size={18} /> Sources
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Always verify financial-aid details on the official university website before applying.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {(u.sources || []).map(function (s, i) {
            return (
              <li key={i} className="flex flex-wrap items-center justify-between gap-3">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  {s.title}
                </a>
                <span className="text-xs text-slate-500">Last verified: {s.lastVerified}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}