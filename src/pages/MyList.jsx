import { Link } from 'react-router-dom';
import { GitCompare } from 'lucide-react';
import { universities } from '../data/universities.js';
import { scholarships } from '../data/scholarships.js';
import { useApp } from '../context/AppContext.jsx';
import UniversityCard from '../components/UniversityCard.jsx';
import ScholarshipCard from '../components/ScholarshipCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import DeadlineCard from '../components/DeadlineCard.jsx';

export default function MyList() {
  const { savedUnis, savedScholarships, compareList } = useApp();

  const unis = savedUnis
    .map(function (id) {
      return universities.find(function (u) { return u.id === id; });
    })
    .filter(Boolean);

  const schs = savedScholarships
    .map(function (id) {
      return scholarships.find(function (s) { return s.id === id; });
    })
    .filter(Boolean);

  const deadlines = [];

  unis.forEach(function (u) {
    if (u.deadlines && u.deadlines.regularDecision) {
      deadlines.push({ title: u.name, date: u.deadlines.regularDecision, type: 'University application' });
    }
    if (u.deadlines && u.deadlines.financialAid) {
      deadlines.push({ title: u.name + ' — Financial aid', date: u.deadlines.financialAid, type: 'Financial aid' });
    }
  });

  schs.forEach(function (s) {
    if (s.deadline) {
      deadlines.push({ title: s.name, date: s.deadline, type: 'Scholarship' });
    }
  });

  deadlines.sort(function (a, b) { return a.date.localeCompare(b.date); });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My List</h1>
        <p className="text-slate-500 text-sm mt-1">Everything you have saved and are tracking.</p>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">
            Saved Universities ({unis.length})
          </h2>
          <Link to="/explore" className="text-sm text-blue-700 hover:underline">
            Add more →
          </Link>
        </div>
        {unis.length === 0 ? (
          <EmptyState
            title="No universities saved"
            description="Save universities to build your application shortlist."
            action={
              <Link
                to="/explore"
                className="rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
              >
                Explore Universities
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unis.map(function (u) {
              return <UniversityCard key={u.id} u={u} />;
            })}
          </div>
        )}
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">
            Saved Scholarships & Aid ({schs.length})
          </h2>
          <Link to="/scholarships" className="text-sm text-blue-700 hover:underline">
            Add more →
          </Link>
        </div>
        {schs.length === 0 ? (
          <EmptyState
            title="No scholarships or aid records saved"
            description="Save financial-aid records to track them here."
            action={
              <Link
                to="/scholarships"
                className="rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
              >
                Browse Scholarships
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schs.map(function (s) {
              return <ScholarshipCard key={s.id} s={s} />;
            })}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-slate-900 mb-3">
          Compare Later ({compareList.length}/4)
        </h2>
        {compareList.length === 0 ? (
          <p className="text-sm text-slate-500">No universities in the comparison list yet.</p>
        ) : (
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
          >
            <GitCompare size={16} /> Open comparison table
          </Link>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-slate-900 mb-3">Export Shortlist</h2>
        <p className="text-sm text-slate-600 mb-3">
          Print or save your shortlist as a PDF — universities, match scores, deadlines, notes, and aid records.
        </p>
        <Link
          to="/export"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
        >
          Open export view
        </Link>
      </section>

      <section>
        <h2 className="font-semibold text-slate-900 mb-3">Upcoming Deadlines</h2>
        {deadlines.length === 0 ? (
          <p className="text-sm text-slate-500">No deadlines from your saved items yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {deadlines.slice(0, 9).map(function (d, i) {
              return <DeadlineCard key={i} item={d} />;
            })}
          </div>
        )}
      </section>
    </div>
  );
}