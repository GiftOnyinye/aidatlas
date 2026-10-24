import { Link } from 'react-router-dom';
import { Award, Bookmark, FileText, Calendar, User } from 'lucide-react';
import { universities } from '../data/universities.js';
import { scholarships } from '../data/scholarships.js';
import { useApp } from '../context/AppContext.jsx';
import { calculateAidAtlasMatch } from '../utils/matching.js';
import UniversityCard from '../components/UniversityCard.jsx';
import ScholarshipCard from '../components/ScholarshipCard.jsx';
import DeadlineCard from '../components/DeadlineCard.jsx';

export default function Dashboard() {
  const { profile, savedUnis, savedScholarships, applications } = useApp();

  if (!profile || (!profile.name && !profile.intendedMajor)) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-4">
          <User size={26} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Build your profile to see your dashboard</h1>
        <p className="text-slate-500 mt-2">
          The AidAtlas matching engine uses your profile to rank universities and aid opportunities.
        </p>
        <Link
          to="/profile"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
        >
          Build Profile
        </Link>
      </div>
    );
  }

  const scored = universities
    .map(function (u) {
      return { u: u, m: calculateAidAtlasMatch(u, profile).score };
    })
    .sort(function (a, b) { return b.m - a.m; });

  const strongMatches = scored.filter(function (x) { return x.m >= 65; }).length;
  const topMatches = scored.slice(0, 5).map(function (x) { return x.u; });

  const deadlines = [];

  universities.forEach(function (u) {
    if (u.deadlines && u.deadlines.regularDecision) {
      deadlines.push({ title: u.name, date: u.deadlines.regularDecision, type: 'University application' });
    }
    if (u.deadlines && u.deadlines.financialAid) {
      deadlines.push({ title: u.name + ' - Financial aid', date: u.deadlines.financialAid, type: 'Financial aid' });
    }
  });

  scholarships.forEach(function (s) {
    if (s.deadline) {
      deadlines.push({ title: s.name, date: s.deadline, type: 'Scholarship' });
    }
  });

  deadlines.sort(function (a, b) { return a.date.localeCompare(b.date); });
  const nextFive = deadlines.slice(0, 5);

  const recommendedSch = scholarships
    .filter(function (s) {
      const list = s.eligibleCountries || [];
      return list.indexOf('All countries') !== -1 || list.indexOf('African countries') !== -1;
    })
    .slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const displayName = profile.name || 'student';

  const stats = [
    { label: 'Strong matches', value: strongMatches, Icon: Award },
    { label: 'Saved universities', value: savedUnis.length, Icon: Bookmark },
    { label: 'Saved aid records', value: savedScholarships.length, Icon: FileText },
    { label: 'Applications tracked', value: Object.keys(applications || {}).length, Icon: FileText }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting}, {displayName}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Here are opportunities that match your profile.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(function (s) {
          const Icon = s.Icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <Icon size={18} className="text-blue-700 mb-2" />
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      <section className="mt-8 bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900 mb-3">Profile summary</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-500">Country</div>
            <div className="text-slate-800">{profile.country || 'Not set'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Intended major</div>
            <div className="text-slate-800">{profile.intendedMajor || 'Not set'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Entry year</div>
            <div className="text-slate-800">{profile.entryYear || 'Not set'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">GPA / Percentage</div>
            <div className="text-slate-800">{profile.gpa || 'Not set'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Testing</div>
            <div className="text-slate-800">
              {(profile.sat || 'No SAT') + ' - ' + (profile.act || 'No ACT')}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Financial need</div>
            <div className="text-slate-800">
              {profile.needFullFunding ? 'High - needs significant aid' : 'Not marked'}
            </div>
          </div>
        </div>
        <Link
          to="/profile"
          className="mt-4 inline-flex items-center gap-2 text-sm text-blue-700 font-medium hover:underline"
        >
          Edit Profile
        </Link>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Top Matches</h2>
          <Link to="/explore" className="text-sm text-blue-700 hover:underline">
            See all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topMatches.map(function (u) {
            return <UniversityCard key={u.id} u={u} />;
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Deadlines Coming Up</h2>
          <Calendar size={16} className="text-slate-400" />
        </div>
        {nextFive.length === 0 ? (
          <p className="text-sm text-slate-500">No deadlines in the dataset yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nextFive.map(function (d, i) {
              return <DeadlineCard key={i} item={d} />;
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Recommended Aid & Scholarships</h2>
          <Link to="/scholarships" className="text-sm text-blue-700 hover:underline">
            See all
          </Link>
        </div>
        {recommendedSch.length === 0 ? (
          <p className="text-sm text-slate-500">No recommended aid records yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedSch.map(function (s) {
              return <ScholarshipCard key={s.id} s={s} />;
            })}
          </div>
        )}
      </section>
    </div>
  );
}