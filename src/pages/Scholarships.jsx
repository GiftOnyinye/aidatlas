import { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { scholarships } from '../data/scholarships.js';
import { applyScholarshipFilters } from '../utils/filters.js';
import ScholarshipCard from '../components/ScholarshipCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';

const initialFilters = {
  funding: [],
  degree: [],
  field: [],
  country: []
};

const filterGroups = [
  {
    title: 'Funding type',
    fields: [
      {
        key: 'funding',
        label: 'Funding type',
        type: 'checkbox-group',
        options: ['Institutional need-based aid', 'Full ride', 'Full tuition', 'Partial tuition']
      }
    ]
  },
  {
    title: 'Eligibility',
    fields: [
      {
        key: 'country',
        label: 'Eligible region',
        type: 'checkbox-group',
        options: ['All countries', 'African countries', 'United States', 'Selected countries', 'Chevening-eligible countries']
      }
    ]
  },
  {
    title: 'Degree',
    fields: [
      {
        key: 'degree',
        label: 'Degree level',
        type: 'checkbox-group',
        options: ['Undergraduate', 'Graduate', 'Doctoral']
      }
    ]
  },
  {
    title: 'Field',
    fields: [
      {
        key: 'field',
        label: 'Field',
        type: 'checkbox-group',
        options: ['All fields', 'STEM', 'Computer Science', 'Engineering']
      }
    ]
  }
];

export default function Scholarships() {
  const [filters, setFilters] = useState(initialFilters);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(function () {
    const t = setTimeout(function () { setLoading(false); }, 250);
    return function () { clearTimeout(t); };
  }, []);

  const results = useMemo(function () {
    let list = applyScholarshipFilters(scholarships, filters);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter(function (s) {
        return (
          s.name.toLowerCase().indexOf(t) !== -1 ||
          (s.provider || '').toLowerCase().indexOf(t) !== -1 ||
          (s.country || '').toLowerCase().indexOf(t) !== -1 ||
          (s.award || '').toLowerCase().indexOf(t) !== -1
        );
      });
    }
    return list;
  }, [filters, q]);

  const clear = function () { setFilters(initialFilters); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Scholarships & Institutional Aid</h1>
        <p className="text-slate-500 text-sm mt-1">
          Institutional need-based aid records and undergraduate scholarships that welcome international students.
        </p>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={function (e) { setQ(e.target.value); }}
            placeholder="Search scholarships by name, provider, country…"
            aria-label="Search scholarships"
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={function () { setMobileFilters(true); }}
          className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="hidden lg:block">
          <FilterPanel filters={filters} setFilters={setFilters} groups={filterGroups} onClear={clear} />
        </aside>

        <div>
          <div className="text-sm text-slate-600 mb-3">
            {results.length} scholarships match your filters
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : results.length === 0 ? (
            <EmptyState
              title="No scholarships found"
              description="Try removing a filter or broadening your search."
              action={
                <button
                  onClick={clear}
                  className="rounded-lg bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map(function (s) {
                return <ScholarshipCard key={s.id} s={s} />;
              })}
            </div>
          )}
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={function () { setMobileFilters(false); }}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-slate-50 rounded-t-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Filters</span>
              <button
                onClick={function () { setMobileFilters(false); }}
                className="text-sm text-blue-700 font-medium"
              >
                Done
              </button>
            </div>
            <FilterPanel filters={filters} setFilters={setFilters} groups={filterGroups} onClear={clear} />
          </div>
        </div>
      )}
    </div>
  );
}