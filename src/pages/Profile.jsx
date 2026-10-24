import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, User } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const DEMO_PROFILE = {
  name: 'Gift',
  country: 'Nigeria',
  citizenship: 'Nigeria',
  intendedMajor: 'Computer Science',
  gpa: '3.9',
  entryYear: '2027',
  needFullFunding: true,
  needLevel: 'high',
  sat: 'Not taken',
  act: 'Not taken',
  englishTest: 'English-medium education',
  preferredCountries: 'United States, Canada',
  preferredClassSize: 'small',
  preferredLocation: 'suburban',
  classRank: '',
  curriculum: ''
};

export default function Profile() {
  const { profile, setProfile, notify } = useApp();

  const [form, setForm] = useState(
    profile || {
      name: '',
      country: '',
      citizenship: '',
      intendedMajor: '',
      gpa: '',
      entryYear: '2027',
      needFullFunding: true,
      needLevel: 'high',
      sat: '',
      act: '',
      englishTest: '',
      preferredCountries: '',
      preferredClassSize: '',
      preferredLocation: '',
      classRank: '',
      curriculum: ''
    }
  );

  const update = function (key, value) {
    setForm(function (f) {
      const next = Object.assign({}, f);
      next[key] = value;
      return next;
    });
  };

  const save = function (e) {
    e.preventDefault();
    setProfile(form);
    notify('Profile saved. Match scores updated.');
  };

  const loadDemo = function () {
    setForm(DEMO_PROFILE);
    setProfile(DEMO_PROFILE);
    notify('Demo profile loaded.');
  };

  const clearProfile = function () {
    const empty = {
      name: '',
      country: '',
      citizenship: '',
      intendedMajor: '',
      gpa: '',
      entryYear: '2027',
      needFullFunding: false,
      needLevel: '',
      sat: '',
      act: '',
      englishTest: '',
      preferredCountries: '',
      preferredClassSize: '',
      preferredLocation: '',
      classRank: '',
      curriculum: ''
    };
    setForm(empty);
    setProfile(empty);
    notify('Profile cleared.');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
          <User size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
          <p className="text-slate-500 text-sm">
            The AidAtlas matching engine uses these details to compute your match score.
          </p>
        </div>
      </div>

      <form onSubmit={save} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 mt-6">
        <section>
          <h2 className="font-semibold text-slate-900 mb-3">Personal</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input
                value={form.name || ''}
                onChange={function (e) { update('name', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Country of residence</label>
              <input
                value={form.country || ''}
                onChange={function (e) { update('country', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Citizenship</label>
              <input
                value={form.citizenship || ''}
                onChange={function (e) { update('citizenship', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Intended entry year</label>
              <input
                value={form.entryYear || ''}
                onChange={function (e) { update('entryYear', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-3">Academic</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Intended major</label>
              <input
                value={form.intendedMajor || ''}
                onChange={function (e) { update('intendedMajor', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">GPA or percentage</label>
              <input
                value={form.gpa || ''}
                onChange={function (e) { update('gpa', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. 3.9 or 92"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Curriculum</label>
              <input
                value={form.curriculum || ''}
                onChange={function (e) { update('curriculum', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. WAEC, IB, A-Levels"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Class rank</label>
              <input
                value={form.classRank || ''}
                onChange={function (e) { update('classRank', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. top 5%"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-3">Testing</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SAT</label>
              <input
                value={form.sat || ''}
                onChange={function (e) { update('sat', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Score or 'Not taken'"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ACT</label>
              <input
                value={form.act || ''}
                onChange={function (e) { update('act', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Score or 'Not taken'"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">English proficiency</label>
              <input
                value={form.englishTest || ''}
                onChange={function (e) { update('englishTest', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. TOEFL 110, IELTS 7.5, English-medium education"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-3">Financial</h2>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.needFullFunding}
              onChange={function (e) { update('needFullFunding', e.target.checked); }}
              className="rounded border-slate-300 text-blue-700"
            />
            <span className="text-slate-700">I need significant financial aid / full funding</span>
          </label>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Level of financial need</label>
            <select
              value={form.needLevel || ''}
              onChange={function (e) { update('needLevel', e.target.value); }}
              className="w-full sm:w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select…</option>
              <option value="high">High — need near-full funding</option>
              <option value="medium">Medium — need partial support</option>
              <option value="low">Low — minimal support</option>
            </select>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-3">Preferences</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred countries</label>
              <input
                value={form.preferredCountries || ''}
                onChange={function (e) { update('preferredCountries', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. United States, Canada"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred class size</label>
              <select
                value={form.preferredClassSize || ''}
                onChange={function (e) { update('preferredClassSize', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">No preference</option>
                <option value="small">Small (under 2,000)</option>
                <option value="medium">Medium (2,000–10,000)</option>
                <option value="large">Large (over 10,000)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred location</label>
              <select
                value={form.preferredLocation || ''}
                onChange={function (e) { update('preferredLocation', e.target.value); }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">No preference</option>
                <option value="urban">Urban</option>
                <option value="suburban">Suburban</option>
                <option value="rural">Rural / college town</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
          >
            <Save size={16} /> Save Profile
          </button>
          <button
            type="button"
            onClick={loadDemo}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Load Demo Profile
          </button>
          <button
            type="button"
            onClick={clearProfile}
            className="rounded-lg text-slate-600 hover:bg-slate-100 px-4 py-2 text-sm font-medium"
          >
            Clear
          </button>
          <Link
            to="/dashboard"
            className="rounded-lg text-blue-700 px-4 py-2 text-sm font-medium hover:underline"
          >
            View Dashboard →
          </Link>
        </div>
      </form>

      <p className="text-xs text-slate-500 mt-4">
        Your profile is stored locally in your browser (localStorage). It is not sent to any server.
      </p>
    </div>
  );
}