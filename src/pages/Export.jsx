import { Link } from 'react-router-dom';
import { Printer, ArrowLeft, ShieldCheck } from 'lucide-react';
import { universities } from '../data/universities.js';
import { scholarships } from '../data/scholarships.js';
import { useApp } from '../context/AppContext.jsx';
import { calculateAidAtlasMatch, matchLabel } from '../utils/matching.js';
import { formatDate } from '../utils/deadlines.js';
import EmptyState from '../components/EmptyState.jsx';

const CATEGORIES = [
  { key: 'academicFit', label: 'Academic fit', max: 25 },
  { key: 'financialFit', label: 'Financial fit', max: 30 },
  { key: 'internationalFit', label: 'International fit', max: 20 },
  { key: 'majorFit', label: 'Major fit', max: 15 },
  { key: 'applicationFit', label: 'Application fit', max: 10 },
  { key: 'preferencesFit', label: 'Preferences fit', max: 10 }
];

function FieldLine({ label, value }) {
  const shown = value === null || value === undefined || value === '' ? 'Data unavailable' : value;
  return (
    <div className="flex text-sm py-0.5">
      <span className="w-44 text-slate-500 shrink-0">{label}:</span>
      <span className="text-slate-900 flex-1">{shown}</span>
    </div>
  );
}

export default function Export() {
  const { profile, savedUnis, savedScholarships, applications, essays, checklist } = useApp();

  const unis = savedUnis
    .map(function (id) { return universities.find(function (u) { return u.id === id; }); })
    .filter(Boolean);

  const schs = savedScholarships
    .map(function (id) { return scholarships.find(function (s) { return s.id === id; }); })
    .filter(Boolean);

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (unis.length === 0 && schs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Export Shortlist</h1>
        <EmptyState
          title="Nothing to export yet"
          description="Save some universities and scholarships first, then export your shortlist."
          action={
            <Link to="/explore" className="rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium">
              Explore Universities
            </Link>
          }
        />
      </div>
    );
  }

  const checklistTotal = unis.length * 11;
  const checklistDone = Object.keys(checklist || {}).reduce(function (sum, uniId) {
    const items = checklist[uniId] || {};
    return sum + Object.keys(items).filter(function (k) { return items[k] === 'Complete'; }).length;
  }, 0);

  const essaysDone = Object.keys(essays || {}).filter(function (k) {
    return essays[k] === 'complete';
  }).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="print:hidden flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/my-list" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm">
            <ArrowLeft size={16} /> Back to My List
          </Link>
        </div>
        <button
          onClick={function () { window.print(); }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 print:border-0 print:rounded-none print:p-0">
        <header className="border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-lg">A</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AidAtlas Shortlist</h1>
              <p className="text-xs text-slate-500">Generated on {today}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-2">
            A planning document, not an admission prediction. Always verify requirements and
            financial-aid policies with each university.
          </p>
        </header>

        {profile && (profile.name || profile.intendedMajor) && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Student profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <FieldLine label="Name" value={profile.name} />
              <FieldLine label="Country" value={profile.country} />
              <FieldLine label="Intended major" value={profile.intendedMajor} />
              <FieldLine label="Entry year" value={profile.entryYear} />
              <FieldLine label="GPA / percentage" value={profile.gpa} />
              <FieldLine label="Testing" value={(profile.sat || 'No SAT') + ' · ' + (profile.act || 'No ACT')} />
              <FieldLine label="Financial need" value={profile.needFullFunding ? 'High — needs significant aid' : 'Not marked'} />
              <FieldLine label="Preferred countries" value={profile.preferredCountries} />
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Universities ({unis.length})
          </h2>
          {unis.map(function (u, idx) {
            const match = calculateAidAtlasMatch(u, profile);
            const label = matchLabel(match.score);
            const app = applications[u.id] || {};

            return (
              <div key={u.id} className="mb-8 pb-6 border-b border-slate-100 last:border-b-0">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {idx + 1}. {u.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {u.city}, {u.country} · {u.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{match.score} / 100</div>
                    <div className="text-xs text-slate-500">{label.label}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-3">
                  <FieldLine label="Website" value={u.website} />
                  <FieldLine label="Application deadline" value={u.deadlines && u.deadlines.regularDecision ? formatDate(u.deadlines.regularDecision) : 'Not yet published for Fall 2027'} />
                  <FieldLine label="Total estimated cost" value={u.costs && u.costs.totalEstimated ? u.costs.currency + ' ' + u.costs.totalEstimated.toLocaleString() : 'Not yet verified'} />
                  <FieldLine label="International aid" value={u.internationalAid} />
                  <FieldLine label="Need-based aid" value={u.needBasedAid} />
                  <FieldLine label="Merit scholarships" value={u.meritAid} />
                  <FieldLine label="Application status" value={app.status || 'Not started'} />
                  <FieldLine label="Financial-aid status" value={app.financialAidStatus} />
                </div>

                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
                    Match breakdown
                  </div>
                  <div className="space-y-1">
                    {CATEGORIES.map(function (c) {
                      const value = match[c.key] || 0;
                      const pct = Math.round((value / c.max) * 100);
                      return (
                        <div key={c.key} className="flex items-center gap-3 text-xs">
                          <span className="w-32 text-slate-600">{c.label}</span>
                          <span className="w-14 text-right text-slate-500">{value} / {c.max}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                            <div className="h-full bg-slate-700 rounded-full" style={{ width: pct + '%' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {match.reasons.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs uppercase tracking-wide text-emerald-700 font-semibold mb-1">
                      Strong fit
                    </div>
                    <ul className="text-xs text-slate-700 space-y-0.5">
                      {match.reasons.map(function (r, i) {
                        return <li key={i}>✓ {r}</li>;
                      })}
                    </ul>
                  </div>
                )}

                {match.concerns.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs uppercase tracking-wide text-amber-700 font-semibold mb-1">
                      Concerns
                    </div>
                    <ul className="text-xs text-slate-700 space-y-0.5">
                      {match.concerns.map(function (r, i) {
                        return <li key={i}>⚠ {r}</li>;
                      })}
                    </ul>
                  </div>
                )}

                {app.notes && (
                  <div className="mt-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">
                      Notes
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap">{app.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {schs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Saved Scholarships & Aid ({schs.length})
            </h2>
            {schs.map(function (s, idx) {
              return (
                <div key={s.id} className="mb-4 pb-3 border-b border-slate-100 last:border-b-0">
                  <h3 className="text-sm font-bold text-slate-900">
                    {idx + 1}. {s.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-1">
                    {s.provider} · {s.fundingType}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <FieldLine label="Deadline" value={s.deadline ? formatDate(s.deadline) : null} />
                    <FieldLine label="Nigerian eligibility" value={s.nigerianEligibility} />
                    <FieldLine label="International eligible" value={s.internationalEligible === true ? 'Yes' : 'Unknown'} />
                    <FieldLine label="Official source" value={s.officialSource} />
                  </div>
                  {s.notes && (
                    <p className="text-xs text-slate-700 mt-2 italic">Note: {s.notes}</p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Progress summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">Checklist items complete</div>
              <div className="text-lg font-bold text-slate-900">{checklistDone} / {checklistTotal}</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">Essay tasks complete</div>
              <div className="text-lg font-bold text-slate-900">{essaysDone}</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">Applications tracked</div>
              <div className="text-lg font-bold text-slate-900">{Object.keys(applications || {}).length}</div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 pt-4 mt-6 flex items-start gap-2">
          <ShieldCheck size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Verification reminder:</strong> All information in this
              document was compiled from official university and scholarship sources at the time of last
              verification. Deadlines, costs, and financial-aid policies can change. Always verify
              details directly on each institution's official website before applying.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Generated by AidAtlas — a planning tool, not an admission prediction.
            </p>
          </div>
        </footer>
      </div>

      <div className="print:hidden mt-6 text-center">
        <p className="text-xs text-slate-500">
          Tip: In the print dialog, choose <strong>"Save as PDF"</strong> as your destination.
        </p>
      </div>
    </div>
  );
}