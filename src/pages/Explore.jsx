import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search } from 'lucide-react';
import { universities, ALL_COUNTRIES, ALL_MAJORS } from '../data/universities.js';
import { applyUniversityFilters } from '../utils/filters.js';
import { calculateAidAtlasMatch } from '../utils/matching.js';
import { useApp } from '../context/AppContext.jsx';
import UniversityCard from '../components/UniversityCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';

const initialFilters = {
  country: [],
  type: [],
  major: [],
  needBased: false,
  meritAid: false,
  fullRide: false,
  internationalAid: false,
  testOptional: false,
  feeWaiver: false,
  maxTuition: ''
};

const filterGroups = [
  { title: 'Geography', fields: [{ key: 'country', label: 'Country', type: 'checkbox-group', options: ALL_COUNTRIES }] },
  { title: 'Institution', fields: [{ key: 'type', label: 'Type', type: 'checkbox-group', options: ['Private', 'Public'] }] },
  { title: 'Academics', fields: [{ key: 'major', label: 'Intended major', type: 'checkbox-group', options: ALL_MAJORS }] },
  { title: 'Financial Aid', fields: [
      { key: 'needBased', label: 'Need-based aid', type: 'checkbox' },
      { key: 'meritAid', label: 'Merit scholarships', type: 'checkbox' },
      { key: 'fullRide', label: 'Full-ride possible', type: 'checkbox' },
      { key: 'internationalAid', label: 'International aid available', type: 'checkbox' }
    ]},
  { title: 'Admission', fields: [
      { key: 'testOptional', label: 'Test optional / not required', type: 'checkbox' },
      { key: 'feeWaiver', label: 'Application fee waiver', type: 'checkbox' }
    ]},
  { title: 'Cost', fields: [{ key: 'maxTuition', label: 'Max total cost (USD)', type: 'number' }] }
];

export default function Explore() {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [q, setQ] = useState(params.get('q') || '');
  const [sort, setSort] = useState('match');
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const { profile } = useApp();

  useEffect(function () {
    const t = setTimeout(function () { setLoading(false); }, 250);
    return function () { clearTimeout(t); };
  }, []);

  useEffect(function () {
    const urlQ = params.get('q');
    if (urlQ) setQ(urlQ);
  }, [params]);

  const results = useMemo(function () {
    let list = applyUniversityFilters(universities, filters);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter(function (u) {
        return (
          u.name.toLowerCase().indexOf(t) !== -1 ||
          u.country.toLowerCase().indexOf(t) !== -1 ||
          u.city.toLowerCase().indexOf(t) !== -1 ||
          u.description.toLowerCase().indexOf(t) !== -1 ||
          (u.majors || []).some(function (m) { return m.name.toLowerCase().indexOf(t) !== -1; })
        );
      });
    }
    if (sort === 'match') {
      list = list.slice().sort(function (a, b) {
        return calculateAidAtlasMatch(b, profile).score - calculateAidAtlasMatch(a, profile).score;
      });
    }
    if (sort === 'cost') {
      list = list.slice().sort(function (a, b) {
        const ac = (a.costs && a.costs.totalEstimated) || 1e9;
        const bc = (b.costs && b.costs.totalEstimated) || 1e9;
        return ac - bc;
      });
    }
    if (sort === 'name') {
      list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    return list;
  }, [filters, q, sort, profile]);

  const clear = function () { setFilters(initialFilters); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate mb-2">Explore Universities</h1>
        <p className="text-muted">
          Filter by geography, academics, financial aid, and admission requirements.
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={function (e) { setQ(e.target.value); }}
            placeholder="Search universities, cities, majors…"
            aria-label="Search universities"
            className="input pl-11"
          />
        </div>
        <select
          value={sort}
          onChange={function (e) { setSort(e.target.value); }}
          className="input md:w-64 cursor-pointer font-semibold text-slate"
        >
          <option value="match">Sort: AidAtlas Match</option>
          <option value="cost">Sort: Lowest estimated cost</option>
          <option value="name">Sort: Name (A–Z)</option>
        </select>
        <button
          onClick={function () { setMobileFilters(true); }}
          className="lg:hidden btn-secondary"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <FilterPanel filters={filters} setFilters={setFilters} groups={filterGroups} onClear={clear} />
        </aside>

        <div>
          <div className="text-sm font-semibold text-muted mb-4 uppercase tracking-wide">
            {results.length} universities match your filters
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : results.length === 0 ? (
            <EmptyState
              title="No universities found"
              description="Try removing a filter or broadening your search."
              action={<button onClick={clear} className="btn-primary">Clear Filters</button>}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map(function (u) { return <UniversityCard key={u.id} u={u} />; })}
            </div>
          )}
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate/40 backdrop-blur-sm" onClick={function () { setMobileFilters(false); }}></div>
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-sand rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-serif text-xl text-slate">Filters</span>
              <button onClick={function () { setMobileFilters(false); }} className="text-sm font-bold text-clay-600">Done</button>
            </div>
            <FilterPanel filters={filters} setFilters={setFilters} groups={filterGroups} onClear={clear} />
          </div>
        </div>
      )}
    </div>
  );
}